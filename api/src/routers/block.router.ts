import { Router } from 'express';
import BlockController from '../controllers/block.controller';

const BlockRouter = Router();
const controller = new BlockController();

BlockRouter.get('/', controller.find);

BlockRouter.get('/:number', controller.findByNumber);

export default BlockRouter;
