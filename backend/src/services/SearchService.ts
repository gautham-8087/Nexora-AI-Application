import { ISearchService, ISearchResult } from '../core/interfaces/ISearchService.js';
import { SourceReference } from '../core/entities/SearchQuery.js';

export class SearchService implements ISearchService {
  private searxngUrl = process.env.SEARXNG_URL || 'http://localhost:8080';

  public async search(query: string): Promise<ISearchResult> {
    const startTime = Date.now();
    console.log(`Nexora SearchService: Dispatching query "${query}" to SearXNG at ${this.searxngUrl}...`);

    try {
      // Fetch from SearXNG API in JSON format
      const response = await fetch(`${this.searxngUrl}/search?q=${encodeURIComponent(query)}&format=json`, {
        signal: AbortSignal.timeout(4000) // Timeout after 4 seconds
      });

      if (!response.ok) {
        throw new Error(`SearXNG HTTP error status ${response.status}`);
      }

      const data: any = await response.json();
      
      if (!data.results || !Array.isArray(data.results)) {
        throw new Error('Invalid JSON structure from SearXNG search results.');
      }

      // Map SearXNG results to Nexora SourceReference structure (top 4 results)
      const sources: SourceReference[] = data.results.slice(0, 4).map((item: any) => ({
        title: item.title || 'Untitled Source',
        url: item.url || '',
        snippet: item.content || item.snippet || 'No summary content preview available for this source link.'
      }));

      console.log(`Nexora SearchService: Retrieved ${sources.length} live results from SearXNG.`);

      return {
        sources,
        searchTime: Date.now() - startTime
      };

    } catch (error: any) {
      console.warn(`Nexora SearchService: SearXNG call failed (${error.message}). Falling back to contextual mock data...`);
      
      // Fallback mock search results in case SearXNG is not running locally
      const queryLower = query.toLowerCase();
      let sources: SourceReference[] = [];

      if (queryLower.includes('agent') || queryLower.includes('autonomous')) {
        sources = [
          {
            title: "State of AI Agents: 2026 Developer Survey (Mock Fallback)",
            url: "https://nexora.ai/research/state-of-ai-agents-2026",
            snippet: "Recent industry telemetry reports that over 74% of enterprise AI budgets have shifted towards multi-agent orchestration frameworks. Semi-autonomous workflows are rapidly replacing traditional static LLM pipeline prompts."
          },
          {
            title: "Next-Gen LLM Tool Calling and Reasoning Loops (Mock Fallback)",
            url: "https://arxiv.org/abs/2602.04591",
            snippet: "Advanced reasoning architectures like ReAct and Self-Reflect have shown a 38% decrease in logic execution loops when integrated with dynamic tool registries."
          },
          {
            title: "Enterprise Agent Frameworks: LangGraph vs Autogen (Mock Fallback)",
            url: "https://techradar.example.com/ai/langgraph-vs-autogen-agent-orchestrator",
            snippet: "LangGraph's state-centric design provides fine-grained control over multi-agent handoffs. Autogen excels in multi-party chat setups."
          }
        ];
      } else {
        sources = [
          {
            title: `Global Reference on ${query} (Mock Fallback)`,
            url: `https://wikipedia.example.org/wiki/${encodeURIComponent(query)}`,
            snippet: `This encyclopedic resource provides standard definitions, reference archives, history, and community summaries regarding the topic of "${query}".`
          },
          {
            title: `Technical Analysis: Synthesizing ${query} (Mock Fallback)`,
            url: `https://medium.example.com/tech-insights/analysis-of-${encodeURIComponent(query)}`,
            snippet: `A detailed technical report reviewing primary resources, software models, data structures, and implementation paradigms related to ${query}.`
          }
        ];
      }

      return {
        sources,
        searchTime: Date.now() - startTime
      };
    }
  }
}
export default SearchService;
