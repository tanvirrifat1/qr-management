import express from 'express';

import { MessageController } from './message.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.get(
  '/get-message/:id',
  auth(
    USER_ROLES.ADMIN,
    USER_ROLES.SELLER,
    USER_ROLES.BUYER,
    USER_ROLES.SUPER_ADMIN
  ),
  MessageController.getAllMessages
);

router.get(
  '/get-recent-message',
  auth(
    USER_ROLES.ADMIN,
    USER_ROLES.SELLER,
    USER_ROLES.BUYER,
    USER_ROLES.SUPER_ADMIN
  ),
  MessageController.getAllRecentMessage
);

export const MessageRoutes = router;
