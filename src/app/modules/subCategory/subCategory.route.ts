import express from 'express';
import { SubCategoryController } from './subCategory.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
const router = express.Router();

router.post(
  '/create-sub-category',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  SubCategoryController.createSubCategory,
);

router.patch(
  '/update-sub-category/:id',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  SubCategoryController.updateSubCategory,
);

router.delete(
  '/delete-sub-category/:id',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  SubCategoryController.deleteCategoryFromDB,
);

router.get(
  '/get-sub-category/:id',
  // auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  SubCategoryController.getSubCategory,
);

router.get(
  '/get-sub-category',
  // auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  SubCategoryController.getSubCategoryForAdmin,
);

export const SubCategoryRoutes = router;
