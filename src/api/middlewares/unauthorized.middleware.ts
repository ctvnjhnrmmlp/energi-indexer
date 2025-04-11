import { NextFunction } from 'express';
import { RESPONSE_CODES, RESPONSE_MESSAGES } from '../../constants/response.constant';
import { AppError } from '../../errors/app.error';

export function unauthorizedMiddleware(next: NextFunction) {
  const error = new AppError(RESPONSE_CODES.UNAUTHORIZED, RESPONSE_MESSAGES.UNAUTHORIZED);
  next(error);
}
