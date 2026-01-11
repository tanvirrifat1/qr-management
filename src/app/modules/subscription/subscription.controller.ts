import { Request, Response } from 'express';
import { stripe } from '../../../shared/stripe';
import config from '../../../config';

import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { SubscriptionService } from './subscription.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

const createCheckoutSessionController = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { packageId, becomeASellerId } = req.body;
  try {
    const sessionUrl = await SubscriptionService.createCheckoutSession(
      userId,
      packageId,
      becomeASellerId
    );
    res.status(200).json({ url: sessionUrl });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
};

const stripeWebhookController = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      config.webhook_secret as string
    );

    await SubscriptionService.handleStripeWebhookService(event);

    res.status(200).send({ received: true });
  } catch (err) {
    // throw new ApiError(
    //   StatusCodes.BAD_REQUEST,
    //   `Webhook Error: ${(err as Error).message}`
    // );

    console.log(err);
  }
};

const getMySubscriptions = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.getMySubscriptions(req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Subscriptions retrived successfully',
    data: result,
  });
});

const updateSubs = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;

  const { newPackageId } = req.body;

  const result = await SubscriptionService.updateSubscriptionPlanService(
    userId,
    newPackageId
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Subscriptions updated successfully',
    data: result,
  });
});

const getAllSubs = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.getAllSubs(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Subscriptions retrived successfully',
    data: result,
  });
});

export const SubscriptionController = {
  createCheckoutSessionController,
  stripeWebhookController,
  getMySubscriptions,
  updateSubs,
  getAllSubs,
};
