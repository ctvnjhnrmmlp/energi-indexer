import { Router } from 'express';
import BlockController from '../controllers/block.controller';

const BlockRouter = Router();
const controller = new BlockController();

// BlockRouter.post('/signin/google', controller.signInGoogle);

export default BlockRouter;
