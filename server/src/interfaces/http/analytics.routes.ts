import { Router } from 'express';
import { AnalyticsController } from './AnalyticsController';

const router = Router();
const analyticsController = new AnalyticsController();

router.post('/', 
  (req, res, next) => analyticsController.receiveAnalytics(req, res, next)
);

export { router as analyticsRoutes };
