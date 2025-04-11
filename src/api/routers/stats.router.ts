import { Router } from 'express';
import StatController from '../controllers/stats.controller';

const StatRouter = Router();
const controller = new StatController();

// StatRouter.post('/signin/google', controller.signInGoogle);

export default StatRouter;
