import { Router } from 'express';
import { joinRequestController } from './joinRequest.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post('/', auth(USER_ROLE.user), joinRequestController.createJoinRequest);
router.patch(
  '/:id',
  auth(USER_ROLE.user),
  joinRequestController.updateJoinRequest,
);
router.patch(
  '/approved/:id',
  auth(USER_ROLE.user),
  joinRequestController.approvedJoinRequest,
);
router.patch(
  '/rejected/:id',
  auth(USER_ROLE.user),
  joinRequestController.rejectedJoinRequest,
);
router.delete(
  '/:id',
  auth(USER_ROLE.user),
  joinRequestController.deleteJoinRequest,
);
router.get(
  '/my-requests',
  auth(USER_ROLE.user),
  joinRequestController.getMyJoinRequest,
);
router.get(
  '/:id',
  auth(USER_ROLE.user),
  joinRequestController.getJoinRequestById,
);
router.get('/', auth(USER_ROLE.user), joinRequestController.getAllJoinRequest);

export const joinRequestRoutes = router;
