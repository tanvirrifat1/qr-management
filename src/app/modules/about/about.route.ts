import express from 'express';
import { USER_ROLES } from '../../../enums/user';
import auth from '../../middlewares/auth';
import { AboutController } from './about.controller';

const router = express.Router();

router.post(
  '/create-about',
  auth(USER_ROLES.SELLER),
  AboutController.createAboutToDB
);

router.get(
  '/get-my-about',
  auth(USER_ROLES.SELLER),
  AboutController.getMyAbout
);

router.get('/get-seller-about/:id', AboutController.getSellerAbout);

export const AboutRoutes = router;
