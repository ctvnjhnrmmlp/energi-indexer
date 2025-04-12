import { NextFunction } from 'express';
import { RESPONSE_CODES, RESPONSE_MESSAGES } from '../constants/response.constant';
import { AppError } from '../errors/app.error';

export function badMiddleware(next: NextFunction) {
  const error = new AppError(RESPONSE_CODES.BAD_REQUEST, RESPONSE_MESSAGES.BAD_REQUEST);
  next(error);
}
