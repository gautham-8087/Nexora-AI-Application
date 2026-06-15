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
  createdAt: string;
}

export interface ThreadRecord {
  id: string;
  query: string;
  messages: ChatMessage[];
  createdAt: string;
  paths?: ChatMessage[][];
  activePathIndex?: number;
}

export interface HistoryItem {
  id: string;
  query: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
