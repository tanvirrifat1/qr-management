import express, { NextFunction, Request, Response } from 'express';
import { uploadMultiple } from '../../../helpers/awsS3';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { BecameASellerValidation } from './becameASeller.validation';
import { BecameASellerController } from './becameASeller.controller';

const router = express.Router();

router.post(
  '/create',
  uploadMultiple,
  auth(USER_ROLES.SELLER, USER_ROLES.BUYER),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = BecameASellerValidation.becameASellerSchema.parse(
        JSON.parse(req.body.data)
      );
    }
    return BecameASellerController.becameASellerCreate(req, res, next);
  }
);

router.patch(
  '/update/:id',
  uploadMultiple,
  auth(USER_ROLES.SELLER, USER_ROLES.BUYER),
  (req: Request, res: Response, next: NextFunction) => {
    const { imagesToDelete, data } = req.body;

    if (!data && imagesToDelete) {
      req.body = { imagesToDelete };
      return BecameASellerController.updateBecameASeller(req, res, next);
    }

    if (data) {
      const parsedData =
        BecameASellerValidation.becameASellerSchemaUpdate.parse(
          JSON.parse(data)
        );

      req.body = { ...parsedData, imagesToDelete };
    }

    return BecameASellerController.updateBecameASeller(req, res, next);
  }
);

router.get(
  '/get-all-data',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  BecameASellerController.getAllSellerData
);

router.get(
  '/get-single-data/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  BecameASellerController.getSingleSellerData
);

router.patch(
  '/update-data/:id',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  BecameASellerController.updateSellerDataFormAdmin
);

export const BecameASellerRoutes = router;
