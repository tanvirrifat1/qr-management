import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { SellerAccountHelthController } from './sellerAccountHelth.controller';

const router = express.Router();

router.get(
  '/account-msg-response',
  auth(USER_ROLES.SELLER),
  SellerAccountHelthController.accountMsgResponse,
);

router.get(
  '/on-time-delivery-ratio',
  auth(USER_ROLES.SELLER),
  SellerAccountHelthController.onTimeDeliveryRatio,
);

router.get(
  '/all-review-and-rating-ratio',
  auth(USER_ROLES.SELLER),
  SellerAccountHelthController.getAllReviewAndRatingRatio,
);

router.get(
  '/account-health-ratio',
  auth(USER_ROLES.SELLER),
  SellerAccountHelthController.getAccountHealthRatio,
);

router.get(
  '/all-sales-report',
  auth(USER_ROLES.SELLER),
  SellerAccountHelthController.getAllSalesReport,
);

router.get(
  '/all-top-sales-products',
  auth(USER_ROLES.SELLER),
  SellerAccountHelthController.getAllTopSalesProducts,
);

export const SellerAccountHelthRoutes = router;
