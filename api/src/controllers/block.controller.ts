import { NextFunction, Request, Response } from 'express';
import { RESPONSE_CODES, RESPONSE_MESSAGES } from '../constants/response.constant';
import { BlockService } from '../services/block.service';

export default class BlockController {
  private blockService: BlockService;

  constructor() {
    this.blockService = new BlockService();
  }

  async find(req: Request, res: Response, next: NextFunction) {
    try {
      const block = await this.blockService.find();
      res.status(RESPONSE_CODES.SUCCESS).json({
        message: RESPONSE_MESSAGES.SUCCESS,
        data: block,
      });
    } catch (error) {
      next(error);
    }
  }

  async findByNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const { number } = req.params;
      const block = await this.blockService.findByNumber({
        number: Number(number),
      });
      res.status(RESPONSE_CODES.SUCCESS).json({
        message: RESPONSE_MESSAGES.SUCCESS,
        data: block,
      });
    } catch (error) {
      next(error);
    }
  }
}
