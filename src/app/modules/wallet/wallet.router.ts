import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { WalletController } from './wallet.controller';

const router = Router();

router.get('/my-wallet', auth(USER_ROLES.SELLER), WalletController.getMyWallet);

router.get(
  '/get-all-wallet',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  WalletController.getAllWallte
);

export const WalletRoutes = router;
