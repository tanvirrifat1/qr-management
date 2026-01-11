import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { OrderConfirmationController } from './orderConfirmation.controller';

const router = express.Router();

router.patch(
  '/order/:id',
  OrderConfirmationController.createOrderConfirmationToDB
);

export const OrderConfirmationRoutes = router;
