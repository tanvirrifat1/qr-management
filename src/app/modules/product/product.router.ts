import express, { NextFunction, Request, Response } from 'express';
import { uploadMultiple } from '../../../helpers/awsS3';
import { ProductController } from './product.controller';
import { ProductValidation } from './product.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.get('/get-all-products', ProductController.getAllProducts);

router.get('/get-single-product/:id', ProductController.getSingleProduct);

router.post(
  '/create-product',
  uploadMultiple,
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.SELLER),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = ProductValidation.createProductZodSchema.parse(
        JSON.parse(req.body.data),
      );
    }
    return ProductController.createProductFromDb(req, res, next);
  },
);

router.post(
  '/create-product-draft',
  uploadMultiple,
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.SELLER),
  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.data) {
      req.body = ProductValidation.createProductZodSchema.parse(
        JSON.parse(req.body.data),
      );
    }
    return ProductController.createProductDraft(req, res, next);
  },
);

router.patch(
  '/update/:id',
  uploadMultiple,
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.SELLER),
  (req: Request, res: Response, next: NextFunction) => {
    const { imagesToDelete, data } = req.body;

    if (!data && imagesToDelete) {
      req.body = { imagesToDelete };
      return ProductController.updateProduct(req, res, next);
    }

    if (data) {
      const parsedData = ProductValidation.updateProductZodSchema.parse(
        JSON.parse(data),
      );

      req.body = { ...parsedData, imagesToDelete };
    }

    return ProductController.updateProduct(req, res, next);
  },
);

router.get(
  '/get-my-products',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.SELLER),
  ProductController.getMyProduct,
);

router.delete(
  '/delete-product/:id',
  auth(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.SELLER),
  ProductController.deleteProduct,
);

// disable product
router.get('/disable-product', ProductController.getAllDiscoutProduct);

export const ProductRoutes = router;
