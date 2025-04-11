import { NextFunction } from 'express';
import { RESPONSE_CODES, RESPONSE_MESSAGES } from '../../constants/response.constant';
import { AppError } from '../../errors/app.error';

export function internalMiddleware(next: NextFunction) {
  const error = new AppError(RESPONSE_CODES.INTERNAL, RESPONSE_MESSAGES.INTERNAL);
  next(error);
}
