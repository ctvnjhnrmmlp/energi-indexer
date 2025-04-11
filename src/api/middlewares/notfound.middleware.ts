import { NextFunction } from 'express';
import { RESPONSE_CODES, RESPONSE_MESSAGES } from '../constants/response.constant';
import { AppError } from '../errors/app.error';

export function notFoundMiddleware(next: NextFunction) {
  const error = new AppError(RESPONSE_CODES.NOT_FOUND, RESPONSE_MESSAGES.NOT_FOUND);
  next(error);
}
