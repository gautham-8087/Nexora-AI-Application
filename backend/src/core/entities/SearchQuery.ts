export interface SourceReference {
  title: string;
  url: string;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: SourceReference[];
  relatedQuestions?: string[];
  stats?: {
    searchTime: number;
    resultsCount: number;
  };
  createdAt: Date;
}

export interface SearchQueryRecord {
  id: string;
  query: string; // The initial query for thread naming
  messages: ChatMessage[];
  createdAt: Date;
  paths?: ChatMessage[][]; // All paths (conversation branches) in this thread
  activePathIndex?: number; // Currently active path index
}
