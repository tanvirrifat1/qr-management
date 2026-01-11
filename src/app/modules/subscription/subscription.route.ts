import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { SubscriptionController } from './subscription.controller';

const router = Router();

router.post(
  '/check-out',
  auth(USER_ROLES.SELLER, USER_ROLES.BUYER),
  SubscriptionController.createCheckoutSessionController
);

router.get(
  '/my-subscriptions',
  auth(USER_ROLES.SELLER, USER_ROLES.BUYER),
  SubscriptionController.getMySubscriptions
);

router.patch(
  '/update-subscription',
  auth(USER_ROLES.SELLER, USER_ROLES.BUYER),
  SubscriptionController.updateSubs
);

router.get(
  '/get-all-subscriptions',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  SubscriptionController.getAllSubs
);

export const SubscriptionRoutes = router;
