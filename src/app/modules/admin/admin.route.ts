import express from 'express';
import { AdminController } from './admin.controller';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from '../user/user.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/create-admin',
  auth(USER_ROLES.SUPER_ADMIN),
  validateRequest(UserValidation.createUserZodSchema),
  AdminController.createAdmin
);

router.get(
  '/get-all-admins',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.getAllAdmins
);

router.get(
  '/get-details/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  AdminController.getAdminDetails
);

export const AdminRoutes = router;
