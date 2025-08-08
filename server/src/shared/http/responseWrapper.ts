import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Response {
      success(data: any, message?: string): void;
      error(code: string, message: string, status?: number): void;
    }
  }
}

export interface ApiSuccessResponse<T = any> {
  success: true;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export const responseWrapper = (req: Request, res: Response, next: NextFunction): void => {
  res.success = function(data: any, message: string = 'Success'): void {
    const response: ApiSuccessResponse = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    
    this.status(200).json(response);
  };

  res.error = function(code: string, message: string, status: number = 400): void {
    const response: ApiErrorResponse = {
      success: false,
      code,
      message,
      timestamp: new Date().toISOString(),
    };
    
    this.status(status).json(response);
  };

  next();
}; 