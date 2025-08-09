import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import logger from '../logger';
import { ApiErrorResponse } from './responseWrapper';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export class ExternalServiceError extends Error implements AppError {
  public statusCode: number = 503;
  public code: string = "EXTERNAL_SERVICE_ERROR";

  constructor(message: string, public service: string) {
    super(message);
    this.name = "ExternalServiceError";
  }
}

export class NotFoundError extends Error implements AppError {
  public statusCode: number = 404;
  public code: string = "NOT_FOUND";

  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends Error implements AppError {
  public statusCode: number = 400;
  public code: string = "VALIDATION_ERROR";

  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export const errorHandler = (
  error: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const correlationId =
    (req.headers["x-correlation-id"] as string) || "unknown";

  logger.error(
    {
      correlationId,
      error: error.message,
      stack: error.stack,
      request: {
        method: req.method,
        url: req.originalUrl || req.url,
        path: req.path,
        headers: {
          "user-agent": req.headers["user-agent"],
          referer: req.headers.referer,
          origin: req.headers.origin,
        },
      },
    },
    "Request error"
  );

  if (error instanceof ZodError) {
    const response: ApiErrorResponse = {
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      })),
      timestamp: new Date().toISOString(),
    };
    return res.status(400).json(response);
  }

  if ('statusCode' in error && error.statusCode) {
    const response: ApiErrorResponse = {
      success: false,
      code: error.code || 'APP_ERROR',
      message: error.message,
      timestamp: new Date().toISOString(),
    };
    return res.status(error.statusCode).json(response);
  }

  const response: ApiErrorResponse = {
    success: false,
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
  };
  return res.status(500).json(response);
};

export const notFoundHandler = (req: Request, res: Response) => {
  const response: ApiErrorResponse = {
    success: false,
    code: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString(),
  };
  res.status(404).json(response);
}; 