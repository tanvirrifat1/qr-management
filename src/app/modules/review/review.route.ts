import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ReviewController } from './review.controller';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';
import { ReviewSchema } from './review.validation';

const router = express.Router();

router.post(
  '/create-review',
  auth(USER_ROLES.BUYER),
  validateRequest(ReviewSchema),
  ReviewController.createReviewToDB
);

router.get(
  '/get-all-review',
  auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  ReviewController.getAllReview
);

router.get('/get-all-data/:id', ReviewController.getAllDataFromUser);

router.get('/review-count/:id', ReviewController.reviewCount);

export const ReviewRoutes = router;
