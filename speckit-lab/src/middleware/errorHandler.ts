import { NextFunction, Request, Response } from 'express';
import { createCorrelationId, log } from '../lib/logger';

const mapErrorToStatus = (code: string): number => {
  if (
    code === 'invalid_credentials' ||
    code === 'invalid_reset_token' ||
    code === 'reset_token_expired' ||
    code === 'reset_token_already_used' ||
    code === 'account_locked' ||
    code === 'account_suspended' ||
    code === 'unauthorized'
  ) {
    return 401;
  }
  if (code === 'duplicate_email' || code === 'invalid_password' || code === 'invalid_input') {
    return 400;
  }
  return 500;
};

/** Attaches a correlation id to each incoming request. */
export const correlationMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const incoming = req.header('x-correlation-id');
  req.correlationId = incoming && incoming.length > 0 ? incoming : createCorrelationId();
  next();
};

/** Converts application errors into non-sensitive API responses. */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const errorCode = error.message || 'internal_error';
  const status = mapErrorToStatus(errorCode);

  log('error', 'request_failed', {
    correlationId: req.correlationId,
    errorCode,
    path: req.path,
    method: req.method,
  });

  res.status(status).json({
    error: errorCode,
    message:
      status >= 500
        ? 'An unexpected error occurred. Please try again later.'
        : 'Request could not be processed.',
    status,
    correlation_id: req.correlationId,
  });
};
