import { GetUpdateProductResponse } from './GetUpdateProductResponse';

export interface GetPagedProductResponse {
  total: number;
  products: GetUpdateProductResponse[];
  page: number;
  size: number;
}
