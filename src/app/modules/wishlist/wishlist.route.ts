import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { WishlistController } from './wishlist.controller';

const router = express.Router();

router.post(
  '/add-to-wishlist/:id',
  auth(USER_ROLES.BUYER),
  WishlistController.createWishList
);

router.post(
  '/remove-from-wishlist/:id',
  auth(USER_ROLES.BUYER),
  WishlistController.removeWishList
);

router.get(
  '/get-all-wishlist',
  auth(USER_ROLES.BUYER),
  WishlistController.getAllWishLists
);

router.get(
  '/get-wishlist/:id',
  auth(USER_ROLES.BUYER),
  WishlistController.getWishList
);

export const WishListRoutes = router;
