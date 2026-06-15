import { ISummarizationService, ISummarizationResult } from '../core/interfaces/ISummarizationService.js';
import { SourceReference } from '../core/entities/SearchQuery.js';

export class SummarizationService implements ISummarizationService {
  private ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
  private modelName = process.env.OLLAMA_MODEL || 'qwen3:8b'; // default to qwen3:8b as requested by the user

  public async summarize(query: string, sources: SourceReference[]): Promise<ISummarizationResult> {
    console.log(`Nexora SummarizationService: Querying Ollama (${this.modelName}) at ${this.ollamaUrl}...`);

    // Compile sources into clean prompt representation
    const sourcesPrompt = sources.map((s, idx) => `[${idx + 1}] Title: ${s.title}\nURL: ${s.url}\nExcerpt: ${s.snippet}\n`).join('\n');

    const systemPrompt = `You are Nexora AI, a conversational search and research companion.
Answer the user's research query based on the provided search sources.
Use inline citation brackets like [1], [2] to reference these sources by their index numbers.
Keep the tone professional, objective, and SaaS-grade. Use markdown headers, bold styles, and bullet points.

Query: ${query}

Sources:
${sourcesPrompt}

At the very end of your response, write exactly three suggested follow-up questions for the user.
Precede each follow-up question with "Follow-up: ".
Example:
Follow-up: What is the history of this topic?
Follow-up: How do businesses implement this technology?
Follow-up: What are the main challenges?`;

    try {
      const response = await fetch(`${this.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.modelName,
          prompt: systemPrompt,
          stream: false
        }),
        signal: AbortSignal.timeout(12000) // Timeout after 12 seconds for LLM generation
      });

      if (!response.ok) {
        throw new Error(`Ollama HTTP error status ${response.status}`);
      }

      const data: any = await response.json();
      const generatedText: string = data.response || '';

      if (!generatedText) {
        throw new Error('Empty response from Ollama model.');
      }

      // Parse generated text to extract suggested questions and clean up final answer card
      const lines = generatedText.split('\n');
      const cleanAnswerLines: string[] = [];
      const relatedQuestions: string[] = [];

      lines.forEach((line) => {
        if (line.trim().startsWith('Follow-up:')) {
          const question = line.replace('Follow-up:', '').trim();
          if (question) {
            relatedQuestions.push(question);
          }
        } else {
          cleanAnswerLines.push(line);
        }
      });

      let answer = cleanAnswerLines.join('\n').trim();
      
      // Clean up trailing header tags or follow-up titles if left behind
      answer = answer.replace(/###?\s*Suggested Follow-up\s*$/i, '').trim();
      answer = answer.replace(/###?\s*Follow-up\s*$/i, '').trim();

      // Ensure we have at least some follow-ups
      const finalRelated = relatedQuestions.length > 0 ? relatedQuestions.slice(0, 3) : [
        `What are the security implications of ${query}?`,
        `How does this compare to previous methods?`,
        `What is the next phase of development?`
      ];

      return {
        answer,
        relatedQuestions: finalRelated
      };

    } catch (error: any) {
      console.warn(`Nexora SummarizationService: Ollama call failed (${error.message}). Synthesizing response dynamically from SearXNG search result snippets...`);

      if (sources && sources.length > 0) {
        // Build a beautiful, informative summary using the actual search result titles and snippets
        let dynamicAnswer = `### Real-time Search Summary for "${query}"\n\n`;
        dynamicAnswer += `We compiled direct insights from verified web sources regarding your research query:\n\n`;
        
        sources.forEach((source, idx) => {
          dynamicAnswer += `* **${source.title}:** ${source.snippet} [${idx + 1}]\n\n`;
        });
        
        dynamicAnswer += `*Note: The local Ollama service (port 11434, model \`${this.modelName}\`) is offline or still downloading. This response has been dynamically synthesized from live SearXNG web search snippets.*`;
        
        // Generate contextual related questions based on the search results
        const related = sources.map(s => `More details from ${s.title.replace(/[^\w\s-]/g, '').substring(0, 40).trim()}?`).slice(0, 3);
        while (related.length < 3) {
          related.push(`Can you explain more about ${query}?`);
        }

        return {
          answer: dynamicAnswer,
          relatedQuestions: related
        };
      }

      return {
        answer: `### Search Service Failure\n\nUnable to fetch search information or contact the local LLM. Please check if your docker container for SearXNG is running on port 8080 and your Ollama model is fully loaded.`,
        relatedQuestions: [
          `How to start SearXNG?`,
          `How to download Ollama?`
        ]
      };
    }
  }
}
export default SummarizationService;
