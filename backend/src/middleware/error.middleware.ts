// error.middleware.ts - Global error handler middleware
// Catches all unhandled errors from route handlers and returns a consistent error response
// Must have 4 parameters (err, req, res, next) for Express to recognize it as error handler

import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Custom error interface with optional statusCode and code fields
export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

/**
 * Global error handler
 * - Logs the full error for debugging
 * - Returns error message to client
 * - In development, includes stack trace for debugging
 */
export const errorHandler = (err: AppError, _req: Request, res: Response, _next: NextFunction): void => {
  logger.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    // Only expose stack trace in development for security
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
