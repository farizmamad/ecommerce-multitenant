export interface IPaginationResponse {
  limit: number;
  page: number;
  totalDocuments: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IPaginated<T> {
  pagination: IPaginationResponse;
  data: T[];
}