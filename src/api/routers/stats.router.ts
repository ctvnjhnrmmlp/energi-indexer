import { Router } from 'express';
import StatController from '../controllers/stats.controller';

const StatRouter = Router();
const controller = new StatController();

StatRouter.get('/', controller.find);

StatRouter.get('/:range', controller.findByRange);

export default StatRouter;
