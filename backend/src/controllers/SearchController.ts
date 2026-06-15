import { Request, Response } from 'express';
import { SearchQueryRecord, ChatMessage } from '../core/entities/SearchQuery.js';
import { SearchService } from '../services/SearchService.js';
import { ExtractionService } from '../services/ExtractionService.js';
import { SummarizationService } from '../services/SummarizationService.js';

// Instantiate services
const searchService = new SearchService();
const extractionService = new ExtractionService();
const summarizationService = new SummarizationService();

// Persistent in-memory history cache
const historyStore: SearchQueryRecord[] = [];

export class SearchController {
  
  /**
   * Orchestrates the search, crawl, and LLM summary flow
   * Supports multi-turn conversation threads.
   * POST /api/search
   */
  public async handleSearch(req: Request, res: Response): Promise<Response> {
    try {
      const { query, threadId, editMessageIndex } = req.body;

      if (!query || typeof query !== 'string' || query.trim() === '') {
        return res.status(400).json({ error: 'Search query is required and must be a valid string.' });
      }

      const cleanQuery = query.trim();
      console.log(`Nexora Core: Processing search query - "${cleanQuery}" (ThreadId: ${threadId || 'New Thread'}, EditIndex: ${editMessageIndex !== undefined ? editMessageIndex : 'None'})`);

      // 1. Search (SearXNG / local fallback)
      const { sources, searchTime } = await searchService.search(cleanQuery);

      // 2. Crawl & Extraction (Firecrawl / local fallback)
      if (sources.length > 0) {
        console.log(`Nexora Core: Scraping contents of top reference - ${sources[0].url}`);
        await extractionService.extractContent(sources[0].url);
      }

      // 3. Synthesize summary answer (Ollama / local fallback)
      const { answer, relatedQuestions } = await summarizationService.summarize(cleanQuery, sources);

      // Assemble chat messages
      const userMessage: ChatMessage = {
        id: `msg_${Date.now()}_usr_${Math.random().toString(36).substring(2, 5)}`,
        sender: 'user',
        text: cleanQuery,
        createdAt: new Date()
      };

      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}_ast_${Math.random().toString(36).substring(2, 5)}`,
        sender: 'assistant',
        text: answer,
        sources,
        relatedQuestions,
        stats: {
          searchTime,
          resultsCount: sources.length
        },
        createdAt: new Date()
      };

      let activeThread: SearchQueryRecord | undefined;

      if (threadId) {
        // Find existing thread
        activeThread = historyStore.find(t => t.id === threadId);
        if (activeThread) {
          // Initialize paths array if missing
          if (!activeThread.paths) {
            activeThread.paths = [[...activeThread.messages]];
            activeThread.activePathIndex = 0;
          }

          if (typeof editMessageIndex === 'number' && editMessageIndex >= 0 && editMessageIndex < activeThread.messages.length) {
            // Conversational Branching (Pencil Edit)
            const prefix = activeThread.messages.slice(0, editMessageIndex);
            const newPath = [...prefix, userMessage, assistantMessage];
            activeThread.paths.push(newPath);
            activeThread.activePathIndex = activeThread.paths.length - 1;
            activeThread.messages = newPath;
            console.log(`Nexora Core: Created branched path ${activeThread.activePathIndex} at message index ${editMessageIndex}`);
          } else {
            // Normal follow-up appends to the current path
            activeThread.messages.push(userMessage, assistantMessage);
            activeThread.paths[activeThread.activePathIndex || 0] = [...activeThread.messages];
            console.log(`Nexora Core: Appended message to path ${activeThread.activePathIndex || 0} for thread ${threadId}`);
          }
        }
      }

      // Create new thread if not found or no threadId passed
      if (!activeThread) {
        activeThread = {
          id: `nex_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          query: cleanQuery, // First query is the thread name
          messages: [userMessage, assistantMessage],
          createdAt: new Date()
        };
        activeThread.paths = [[userMessage, assistantMessage]];
        activeThread.activePathIndex = 0;
        historyStore.unshift(activeThread);
        console.log(`Nexora Core: Created new multi-turn thread: ${activeThread.id}`);
      }

      // Limit history cache to last 50 queries
      if (historyStore.length > 50) {
        historyStore.pop();
      }

      return res.status(200).json(activeThread);
    } catch (error: any) {
      console.error('Error in SearchController.handleSearch:', error.message);
      return res.status(500).json({ error: 'Internal server error during search execution' });
    }
  }

  /**
   * Switches the active version branch of a thread
   * POST /api/search/switch-path
   */
  public async switchPath(req: Request, res: Response): Promise<Response> {
    try {
      const { threadId, pathIndex } = req.body;
      if (!threadId || typeof pathIndex !== 'number') {
        return res.status(400).json({ error: 'threadId and pathIndex are required.' });
      }

      const thread = historyStore.find(t => t.id === threadId);
      if (!thread) {
        return res.status(404).json({ error: 'Research query thread not found' });
      }

      if (!thread.paths || pathIndex < 0 || pathIndex >= thread.paths.length) {
        return res.status(400).json({ error: 'Invalid path index.' });
      }

      thread.activePathIndex = pathIndex;
      thread.messages = [...thread.paths[pathIndex]];
      console.log(`Nexora Core: Switched thread ${threadId} to path index ${pathIndex}`);

      return res.status(200).json(thread);
    } catch (error: any) {
      console.error('Error in SearchController.switchPath:', error.message);
      return res.status(500).json({ error: 'Failed to switch path branch' });
    }
  }

  /**
   * Retrieves summary of search thread queries for sidebar tracking
   * GET /api/history
   */
  public async getHistory(req: Request, res: Response): Promise<Response> {
    try {
      // Return brief metadata for history
      const historyList = historyStore.map(item => ({
        id: item.id,
        query: item.query,
        createdAt: item.createdAt
      }));
      return res.status(200).json(historyList);
    } catch (error: any) {
      console.error('Error in SearchController.getHistory:', error.message);
      return res.status(500).json({ error: 'Failed to retrieve search thread history' });
    }
  }

  /**
   * Retrieves deep details of a specific thread by ID
   * GET /api/search/:id
   */
  public async getSearchById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const record = historyStore.find(item => item.id === id);

      if (!record) {
        return res.status(404).json({ error: 'Research query thread not found' });
      }

      return res.status(200).json(record);
    } catch (error: any) {
      console.error('Error in SearchController.getSearchById:', error.message);
      return res.status(500).json({ error: 'Failed to retrieve query details' });
    }
  }
}
export const searchController = new SearchController();
