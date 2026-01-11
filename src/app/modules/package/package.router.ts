import express from 'express';

import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { PackageController } from './package.controller';

const router = express.Router();

router.post(
  '/create-package',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  PackageController.createPackage
);

router.patch(
  '/update-package/:id',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  PackageController.updatePackage
);

router.delete(
  '/delete-package/:id',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  PackageController.deletePackage
);

router.get(
  '/get-all-package',
  //   auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  PackageController.getAllPackage
);

router.get(
  '/get-single-package/:id',
  //   auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  PackageController.getSinglePackage
);

export const PackageRoutes = router;
