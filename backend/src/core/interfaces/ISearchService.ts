import { SourceReference } from '../entities/SearchQuery.js';

export interface ISearchResult {
  sources: SourceReference[];
  searchTime: number;
}

export interface ISearchService {
  search(query: string): Promise<ISearchResult>;
}
