import { Router } from 'express';
import { eventsController } from './events.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import multer from 'multer';
import uploadMultiple from './../../middleware/uploadMulti';
import parseData from '../../middleware/parseData';

const router = Router();
const uploads = multer({ storage: multer.memoryStorage() });
const files = [{ name: 'images', maxCount: 5 }];

router.post(
  '/',
  auth(USER_ROLE.user),
  uploads.fields(files),
  parseData(),
  uploadMultiple(files),
  eventsController.createEvents,
);
// router.patch('/join/:id', auth(USER_ROLE.user), eventsController.joinEvent);
router.patch(
  '/remove/:id',
  auth(USER_ROLE.user, USER_ROLE.admin),
  eventsController.removeFromEvent,
);
router.patch(
  '/:id',
  auth(USER_ROLE.user, USER_ROLE.admin),
  uploads.fields(files),
  parseData(),
  uploadMultiple(files),

  eventsController.updateEvents,
);
router.delete(
  '/:id',
  auth(USER_ROLE.user, USER_ROLE.admin, USER_ROLE.super_admin),
  eventsController.deleteEvents,
);

router.get('/my-events', auth(USER_ROLE.user), eventsController.getMyEvents);
router.get('/:id', eventsController.getEventsById);
router.get('/', eventsController.getAllEvents);

export const eventsRoutes = router;
