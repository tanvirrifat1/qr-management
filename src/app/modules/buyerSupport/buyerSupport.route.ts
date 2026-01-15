import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { uploadMultiple } from '../../../helpers/awsS3';
import { updateZodSchema } from './buyerSupport.validation';
import { BuyerSupportController } from './buyerSupport.controller';

const router = express.Router();

router.post(
  '/send',
  uploadMultiple,
  auth(USER_ROLES.BUYER, USER_ROLES.SELLER),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = updateZodSchema.parse(JSON.parse(req.body.data));
    }
    return BuyerSupportController.createBuyerSupport(req, res, next);
  }
);

router.get(
  '/get-all-support',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  BuyerSupportController.getAllSupport
);

router.patch(
  '/provide-support/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  BuyerSupportController.provideSupport
);

export const BuyerSupportRoutes = router;
