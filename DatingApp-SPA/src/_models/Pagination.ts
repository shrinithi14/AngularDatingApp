import { NumberSymbol } from '@angular/common';

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export class PaginatedData<T> {
  result: T;
  pagination: Pagination;
}
