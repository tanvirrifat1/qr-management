import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { OrderController } from './order.controller';

const router = express.Router();

router.post(
  '/create-order',
  auth(USER_ROLES.BUYER),
  OrderController.createOrder
);

router.get(
  '/get-all-order-for-buyer',
  auth(USER_ROLES.BUYER),
  OrderController.getAllOrderforBuyer
);

router.get(
  '/get-order-by-seller',
  auth(USER_ROLES.SELLER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  OrderController.getOrderBySeller
);

router.get(
  '/get-single-order/:id',
  auth(USER_ROLES.SELLER),
  OrderController.getSingleOrder
);

export const OrderRoutes = router;
