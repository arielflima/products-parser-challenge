import { Response } from 'express';

interface ApiResponseData<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type ApiResponse<T> = Response & ApiResponseData<T>;

export function sendResponse<T>(
  res: Response,
  success: boolean,
  data?: T,
  error?: string,
  statusCode: number = 200,
): ApiResponse<T> {
  return res.status(statusCode).json({
    success,
    data,
    error,
  }) as ApiResponse<T>;
}
