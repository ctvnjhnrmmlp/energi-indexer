import { Request, Response } from 'express';
import { RESPONSE_CODES, RESPONSE_MESSAGES } from '../../constants/response.constant';
import { AppError } from '../../errors/app.error';
import { logger } from '../../utilities/logger.utility';

export function errorMiddleware(err: AppError, req: Request, res: Response) {
  logger.error(err.message);

  if (err instanceof AppError) {
    return res.status(err.code).json({
      message: err.message,
    });
  }

  return res.status(RESPONSE_CODES.INTERNAL).json({
    message: RESPONSE_MESSAGES.INTERNAL,
  });
}
