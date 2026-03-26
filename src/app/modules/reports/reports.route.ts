import { Router } from 'express';
import { reportsController } from './reports.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post('/', auth(USER_ROLE.user), reportsController.createReports);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.super_admin, USER_ROLE.sub_admin),
  reportsController.deleteReports,
);
router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.super_admin, USER_ROLE.sub_admin),
  reportsController.getReportsById,
);
router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.super_admin, USER_ROLE.sub_admin),
  reportsController.getAllReports,
);

export const reportsRoutes = router;
