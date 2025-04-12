import { NextFunction, Request, Response } from 'express';
import { RESPONSE_CODES, RESPONSE_MESSAGES } from '../constants/response.constant';
import { TxService } from '../services/tx.service';

export default class TxController {
  private txService: TxService;

  constructor() {
    this.txService = new TxService();
  }

  async findFirst(req: Request, res: Response, next: NextFunction) {
    try {
      const tx = await this.txService.findFirst();
      res.status(RESPONSE_CODES.SUCCESS).json({
        message: RESPONSE_MESSAGES.SUCCESS,
        data: tx,
      });
    } catch (error) {
      next(error);
    }
  }

  async findByHash(req: Request, res: Response, next: NextFunction) {
    try {
      const hash = req.params.hash;
      const tx = await this.txService.findByHash({ hash });
      res.status(RESPONSE_CODES.SUCCESS).json({
        message: RESPONSE_MESSAGES.SUCCESS,
        data: tx,
      });
    } catch (error) {
      next(error);
    }
  }
}
