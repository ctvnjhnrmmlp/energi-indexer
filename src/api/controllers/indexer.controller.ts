import { NextFunction, Request, Response } from 'express';
import { RESPONSE_CODES, RESPONSE_MESSAGES } from '../constants/response.constant';
import { IndexerService } from '../services/indexer.service';

export default class IndexerController {
  private indexerService: IndexerService;

  constructor() {
    this.indexerService = new IndexerService();
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const { scan } = req.params;
      const [from, to] = (scan as string).split(':').map(Number);
      this.indexerService.index({ from, to });
      res.status(RESPONSE_CODES.SUCCESS).json({
        message: RESPONSE_MESSAGES.SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  }
}
