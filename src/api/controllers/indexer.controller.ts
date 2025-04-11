import { NextFunction, Request, Response } from 'express';
import { RESPONSE_CODES, RESPONSE_MESSAGES } from '../constants/response.constant';
import { IndexerService } from '../services/indexer.service';

export default class IndexerController {
  private indexerService: IndexerService;

  constructor() {
    this.indexerService = new IndexerService();
  }

  public index = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { scan } = req.query;
      const scanParam = typeof scan === 'string' ? scan : '';
      const [from, to] = scanParam.split(':').map(Number);

      if (isNaN(from)) {
        res.status(400).json({ message: 'Invalid scan format. Expected "from:to".' });
        return;
      }

      await this.indexerService.index({ from, to });
      res.status(RESPONSE_CODES.SUCCESS).json({ message: RESPONSE_MESSAGES.SUCCESS });
    } catch (error) {
      next(error);
    }
  };
}
