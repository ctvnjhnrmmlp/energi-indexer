import { NextFunction, Request, Response } from 'express';
import { RESPONSE_CODES, RESPONSE_MESSAGES } from '../constants/response.constant';
import { badMiddleware } from '../middlewares/bad.middleware';
import { StatService } from '../services/stats.service';

export default class StatController {
  private statService: StatService;

  constructor() {
    this.statService = new StatService();
  }

  // async signInGoogle(req: Request, res: Response, next: NextFunction) {
  //   if (!req.headers.authorization) {
  //     badMiddleware(next);
  //   }

  //   try {
  //     const idToken = req.headers.authorization?.split(' ')[1] as string;
  //     const { authToken, user, role } = await this.authService.signInGoogle(idToken);
  //     return res.status(RESPONSE_CODES.SUCCESS).json({ message: RESPONSE_MESSAGES.SUCCESS, authToken, user, role });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}
