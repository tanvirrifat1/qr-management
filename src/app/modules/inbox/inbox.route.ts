import express from 'express';
import { InboxController } from './inbox.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/send-message/:id',
  auth(
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.BUYER,
    USER_ROLES.SELLER
  ),
  InboxController.createInboxToDb
);

router.get(
  '/get-inbox',
  auth(
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.BUYER,
    USER_ROLES.SELLER
  ),
  InboxController.getAllInboxs
);

router.delete(
  '/delete-inbox/:id',
  auth(
    USER_ROLES.ADMIN,
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.BUYER,
    USER_ROLES.SELLER
  ),
  InboxController.deleteInbox
);

export const InboxRoutes = router;
