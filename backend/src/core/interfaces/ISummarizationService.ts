import { SourceReference } from '../entities/SearchQuery.js';

export interface ISummarizationResult {
  answer: string;
  relatedQuestions: string[];
}

export interface ISummarizationService {
  summarize(query: string, sources: SourceReference[]): Promise<ISummarizationResult>;
}
