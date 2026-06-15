export interface IExtractionService {
  extractContent(url: string): Promise<string>;
}
