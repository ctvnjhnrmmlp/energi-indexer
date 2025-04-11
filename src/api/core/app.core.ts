import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import { errorMiddleware } from '../middlewares/error.middleware';
import BlockRouter from '../routers/block.router';
import StatRouter from '../routers/stats.router';
import TxRouter from '../routers/tx.router';

dotenv.config();

export class AppInstance {
  public instance;
  public port;

  constructor() {
    this.instance = express();
    this.port = process.env.PORT || 8000;
    this.instance.use(helmet());
    this.instance.use(
      cors({
        optionsSuccessStatus: 200,
      })
    );
    this.instance.use(express.json());
    this.instance.use(
      express.urlencoded({
        extended: true,
      })
    );
    this.instance.use('/api/block', BlockRouter);
    this.instance.use('/api/stat', StatRouter);
    this.instance.use('/api/tx', TxRouter);
    this.instance.use(errorMiddleware);
  }

  public start() {
    try {
      this.instance.listen(this.port, () => {
        console.log(`Application is running on port ${this.port}.`);
      });
    } catch (error) {
      process.exit(1);
    }
  }
}
