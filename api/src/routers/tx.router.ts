import { Router } from 'express';
import TxController from '../controllers/tx.controller';

const TxRouter = Router();
const controller = new TxController();

TxRouter.get('/', controller.findFirst);

TxRouter.get('/:hash', controller.findByHash);

export default TxRouter;
