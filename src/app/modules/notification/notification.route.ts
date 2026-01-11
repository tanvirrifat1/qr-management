import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { NotificationController } from './notification.controller';

const router = express.Router();

router.get(
  '/get-notification',
  auth(
    USER_ROLES.SELLER,
    USER_ROLES.BUYER,
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN
  ),
  NotificationController.getNotificationToDb
);

router.patch(
  '/update-notification',
  auth(
    USER_ROLES.SELLER,
    USER_ROLES.BUYER,
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN
  ),
  NotificationController.readNotification
);

router.get(
  '/admin',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  NotificationController.adminNotificationFromDB
);

router.patch(
  '/admin',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  NotificationController.adminReadNotification
);

router.delete(
  '/delete-all',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  NotificationController.deleteAllNotifications
);

export const NotificationRoutes = router;
