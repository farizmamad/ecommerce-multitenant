import { LIMIT_PER_PAGE, PAGE } from '../common/constants/pagination.constant';
import { IPaginationResponse } from '../common/interfaces/paginated.interface';

type PaginationOptions = { limit: number; page: number; count: number };

export function getPaginationQuery(options: PaginationOptions) {
  options.limit = options.limit ?? LIMIT_PER_PAGE;
  options.page = options.page ?? PAGE;
  return {
    ...options,
    skip: options.limit * (options.page - 1),
  };
}

export function getPaginationResponse(options: Required<PaginationOptions>): IPaginationResponse {
  return {
  limit: options.limit,
  page: options.page,
  totalDocuments: options.count,
  hasNextPage: options.count > options.limit * options.page,
  hasPrevPage: options.page > 1,
}
}