import { NextFunction, Request, Response } from 'express';
import { RESPONSE_CODES, RESPONSE_MESSAGES } from '../constants/response.constant';
import { StatService } from '../services/stats.service';

export default class StatController {
  private statService: StatService;

  constructor() {
    this.statService = new StatService();
  }

  async find(req: Request, res: Response, next: NextFunction) {
    try {
      const stat = await this.statService.find();
      res.status(RESPONSE_CODES.SUCCESS).json({
        message: RESPONSE_MESSAGES.SUCCESS,
        data: stat,
      });
    } catch (error) {
      next(error);
    }
  }

  async findByRange(req: Request, res: Response, next: NextFunction) {
    try {
      const [start, end] = req.params.range.split(':').map(Number);
      const stat = await this.statService.findByRange({ start, end });
      res.status(RESPONSE_CODES.SUCCESS).json({
        message: RESPONSE_MESSAGES.SUCCESS,
        data: stat,
      });
    } catch (error) {
      next(error);
    }
  }
}
