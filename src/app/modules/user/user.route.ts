import express, { NextFunction, Request, Response } from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { UserController } from './user.controller';
import { UserValidation } from './user.validation';
import validateRequest from '../../middlewares/validateRequest';
import { uploadMultiple } from '../../../helpers/awsS3';

const router = express.Router();

router.post(
  '/create-buyer',
  validateRequest(UserValidation.createUserZodSchema),
  UserController.createBuyerToDB
);

router.patch(
  '/update-profile',
  // uploadAwsS3Bucket.single('image'),
  uploadMultiple,
  auth(
    USER_ROLES.ADMIN,
    USER_ROLES.BUYER,
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.SELLER
  ),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = UserValidation.updateZodSchema.parse(
        JSON.parse(req.body.data)
      );
    }
    return UserController.updateProfile(req, res, next);
  }
);

router.patch(
  '/suspended-user/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  UserController.suspendedUser
);

router.patch(
  '/active-user/:id',
  auth(USER_ROLES.SUPER_ADMIN),
  UserController.activeUser
);

router.get(
  '/get-user-details',
  auth(
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.ADMIN,
    USER_ROLES.SELLER,
    USER_ROLES.BUYER
  ),
  UserController.getUserDetails
);

export const UserRoutes = router;
