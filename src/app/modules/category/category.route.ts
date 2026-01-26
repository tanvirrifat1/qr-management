import express, { NextFunction, Request, Response } from 'express';
import { uploadMultiple } from '../../../helpers/awsS3';
import { CategoryValidation } from './category.validation';
import { CategoryController } from './category.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/create-category',
  uploadMultiple,
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = CategoryValidation.createCategoryZodSchema.parse(
        JSON.parse(req.body.data),
      );
    }
    return CategoryController.createCategoryToDB(req, res, next);
  },
);

router.patch(
  '/update/:id',
  uploadMultiple,
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = CategoryValidation.updateCategoryZodSchema.parse(
        JSON.parse(req.body.data),
      );
    }
    return CategoryController.uppdateProductToDB(req, res, next);
  },
);

router.get('/get-category', CategoryController.getAllCategoryFromDB);

router.get('/get-category/:id', CategoryController.getSingleCategoryFromDB);

router.delete(
  '/delete/:id',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  CategoryController.deleteCategoryFromDB,
);

export const CategoryRoutes = router;
