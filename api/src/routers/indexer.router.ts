import { Router } from 'express';
import IndexerController from '../controllers/indexer.controller';

const IndexerRouter = Router();
const controller = new IndexerController();

IndexerRouter.get('/', controller.index);

export default IndexerRouter;
