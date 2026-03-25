import { Router } from 'express';
import { otpRoutes } from '../modules/otp/otp.routes';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { notificationRoutes } from '../modules/notification/notificaiton.route';
import { contentsRoutes } from '../modules/contents/contents.route';
import { eventsRoutes } from '../modules/events/events.route';
import { joinRequestRoutes } from '../modules/joinRequest/joinRequest.route';
import { chatRoutes } from '../modules/chat/chat.route';
import uploadRouter from '../modules/uploads/route';

const router = Router();
const moduleRoutes = [
  {
    path: '/join-request',
    route: joinRequestRoutes,
  },
  {
    path: '/events',
    route: eventsRoutes,
  },
  {
    path: '/uploads',
    route: uploadRouter,
  },
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/otp',
    route: otpRoutes,
  },
  {
    path: '/notifications',
    route: notificationRoutes,
  },
  {
    path: '/contents',
    route: contentsRoutes,
  },
  {
    path: '/chat',
    route: chatRoutes,
  },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
