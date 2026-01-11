import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { AdminAccountHealthController } from './adminAccountHealth.controller';

const router = express.Router();

router.get(
  '/dashboard-instance',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  AdminAccountHealthController.dashboardInstance
);

router.get(
  '/get-seller-performance',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  AdminAccountHealthController.sellerPerformance
);

router.get(
  '/get-all-revenue',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  AdminAccountHealthController.getAllRevenue
);

router.get(
  '/get-all-product-inventory',
  auth(USER_ROLES.SELLER),
  AdminAccountHealthController.getAllProductInventory
);

router.get(
  '/get-all-seller-req-data',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  AdminAccountHealthController.getAllSellerReqData
);

export const AdminAccountHealthRoutes = router;
