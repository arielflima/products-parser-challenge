import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { GetUpdateProductResponse } from '../responses/GetUpdateProductResponse';
import { GetPagedProductResponse } from '../responses/GetPagedProductResponse';
import { sendResponse, ApiResponse } from '../../utils/response';
import { toList } from '../mappers/ProductMapper';
import { MAX_PAGE_SIZE } from '../../infra/constants';
import { INTERNAL_SERVER_ERROR } from '../../utils/errorMessages';

// GET /products/:code
export const getProduct = async (
  req: Request,
  res: Response,
): Promise<ApiResponse<GetUpdateProductResponse>> => {
  const { code } = req.params;
  try {
    const product = await ProductService.getProduct(code);
    return sendResponse(res, true, product);
  } catch (error) {
    sendResponse(res, false, undefined, INTERNAL_SERVER_ERROR, 500);
    throw error;
  }
};

// GET /products
export const getProducts = async (
  req: Request,
  res: Response,
): Promise<ApiResponse<GetPagedProductResponse>> => {
  const { page = 1, size = 10 } = req.query;
  const pageInt = parseInt(page as string);
  const maxPageSize = parseInt(MAX_PAGE_SIZE as string);
  const sizeInt =
    parseInt(size as string) > maxPageSize
      ? maxPageSize
      : parseInt(size as string);

  try {
    const products = await ProductService.getProducts(pageInt, sizeInt);
    const total = await ProductService.getProductsCount();
    const response = toList(products, pageInt, total, sizeInt);
    return sendResponse(res, true, response);
  } catch (error) {
    sendResponse(res, false, undefined, INTERNAL_SERVER_ERROR, 500);
    throw error;
  }
};

// GET /products/search
export const searchProducts = async (
  req: Request,
  res: Response,
): Promise<ApiResponse<GetPagedProductResponse>> => {
  const { query } = req.query;
  try {
    const products = await ProductService.searchProducts(query as string);
    const response = toList(products, 1, products.length, products.length);
    return sendResponse(res, true, response);
  } catch (error) {
    sendResponse(res, false, undefined, INTERNAL_SERVER_ERROR, 500);
    throw error;
  }
};

// PUT /products/:code
export const updateProduct = async (
  req: Request,
  res: Response,
): Promise<ApiResponse<GetUpdateProductResponse>> => {
  const { code } = req.params;
  const data = req.body;
  try {
    const product = await ProductService.updateProduct(code, data);
    return sendResponse(res, true, product);
  } catch (error) {
    sendResponse(res, false, undefined, INTERNAL_SERVER_ERROR, 500);
    throw error;
  }
};

// DELETE /products/:code
export const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<ApiResponse<boolean>> => {
  const { code } = req.params;
  try {
    await ProductService.deleteProduct(code);
    return sendResponse(res, true);
  } catch (error) {
    sendResponse(res, false, undefined, INTERNAL_SERVER_ERROR, 500);
    throw error;
  }
};
