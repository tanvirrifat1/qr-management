import { NextFunction, Request, Response, Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { WithdrowMoneyController } from './withdrowMoney.controller';
import fileUploadHandler from '../../middlewares/fileUploadHandler';
import { withdrawSchema } from './withdrowMoney.validation';
import { uploadMultiple } from '../../../helpers/awsS3';

const router = Router();

router.post(
  '/request-withdraw',
  auth(USER_ROLES.SELLER),
  WithdrowMoneyController.requestWithdraw
);

router.get(
  '/admin-withdraw-requests',
  auth(USER_ROLES.SUPER_ADMIN),
  WithdrowMoneyController.getAllWithdrawRequests
);

router.patch(
  '/paid-withdraw/:id',
  uploadMultiple,
  auth(USER_ROLES.SUPER_ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = withdrawSchema.parse(JSON.parse(req.body.data));
    }
    return WithdrowMoneyController.paidWithdraw(req, res, next);
  }
);

router.get(
  '/my-withdraw-history',
  auth(USER_ROLES.SELLER),
  WithdrowMoneyController.getMyWithdrawHistory
);

router.get(
  '/my-all-history',
  auth(USER_ROLES.SUPER_ADMIN),
  WithdrowMoneyController.getAllWithdrawHistory
);

export const WithdrawRoutes = router;
