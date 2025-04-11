import { Router } from 'express';
import TxController from '../controllers/tx.controller';

const TxRouter = Router();
const controller = new TxController();

// TxRouter.post('/signin/google', controller.signInGoogle);

export default TxRouter;
