import { Router } from 'express';
import { dashboardController } from './dashboard.controller';

const router = Router();

router.get('/cards', dashboardController.dashboardCards);
router.get('/overview', dashboardController.dashboardOverview);

export const dashboardRoutes = router;
