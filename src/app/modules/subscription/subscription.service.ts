import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { Package } from '../package/package.model';
import { stripe } from '../../../shared/stripe';
import Stripe from 'stripe';
import { WebhookService } from '../../../shared/webhooks';
import { Subscription } from './subscription.model';
import { BecameASeller } from '../becameASeller/becameASeller.model';
import { handlePaymentSuccess } from '../payment/payment.service';

const createCheckoutSession = async (
  userId: string,
  packageId: string,
  becomeASellerId: string,
) => {
  try {
    const [user, plan, becomeASeller] = await Promise.all([
      User.findById(userId),
      Package.findById(packageId),
      BecameASeller.findById(becomeASellerId),
    ]);

    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
    }
    if (!becomeASeller) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'BecameASeller not found');
    }
    if (!plan) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Package not found');
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      success_url: 'https://holybot.ai/paymentsuccess',
      cancel_url: 'https://holybot.ai/paymentFail',
      customer_email: user.email,
      metadata: { userId, packageId, becomeASellerId, type: 'subscription' },
    });

    return session.url;
  } catch (error: any) {
    throw error instanceof ApiError
      ? error
      : new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          error?.message || 'Failed to create checkout session',
        );
  }
};

const handleStripeWebhookService = async (event: any) => {
  switch (event.type) {
    case 'checkout.session.completed':
      if (event?.data?.object?.metadata?.type === 'payment') {
        await handlePaymentSuccess(event);
      } else {
        await WebhookService.handleCheckoutSessionCompleted(event.data.object);
      }
      break;

    case 'invoice.payment_succeeded':
      await WebhookService.handleInvoicePaymentSucceeded(event.data.object);
      break;

    case 'invoice.payment_failed':
      await WebhookService.handleInvoicePaymentFailed(event.data.object);
      break;

    case 'checkout.session.async_payment_failed':
      await WebhookService.handleAsyncPaymentFailed(event.data.object);
      break;

    case 'customer.subscription.deleted':
      await WebhookService.handleSubscriptionDeleted(event.data.object);
      break;

    default:
      // throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid event type');
      return;
  }
};

const updateExpiredSubscriptions = async () => {
  const currentDate = new Date();

  try {
    // Find all expired subscriptions
    const expiredSubscriptions = await Subscription.find({
      endDate: { $lt: currentDate },
    });

    if (!expiredSubscriptions.length) {
      return;
    }

    // Extract user IDs from expired subscriptions
    const expiredUserIds = expiredSubscriptions.map(sub => sub.userId);

    // Update all users' subscription status to false
    await User.updateMany(
      { _id: { $in: expiredUserIds } },
      { $set: { subscription: false } },
    );
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Error updating subscriptions');
  }
};

const getMySubscriptions = async (userId: string) => {
  try {
    const subscriptions = await Subscription.find({ userId }).populate(
      'packageId',
    );
    return subscriptions;
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Error getting subscriptions');
  }
};

const updateSubscriptionPlanService = async (
  userId: string,
  newPackageId: string,
) => {
  // ---------------- Validate User ----------------
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'User not found');
  }

  // ---------------- Validate Subscription ----------------
  const subscription = await Subscription.findOne({ userId });
  if (!subscription) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Subscription not found');
  }

  // ---------------- Validate New Plan ----------------
  const newPlan = await Package.findById(newPackageId);
  if (!newPlan) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'New plan not found');
  }

  const stripeSubId = subscription.subscriptionId;

  // ---------------- Get Stripe Subscription ----------------
  const stripeSubscription = await stripe.subscriptions.retrieve(stripeSubId);
  if (!stripeSubscription) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Stripe subscription not found',
    );
  }

  const currentItem = stripeSubscription.items.data[0];

  // ---------------- Update Plan in Stripe ----------------
  const updatedStripeSubscription = await stripe.subscriptions.update(
    stripeSubId,
    {
      items: [
        {
          id: currentItem.id,
          price: newPlan.priceId,
        },
      ],
      proration_behavior: 'create_prorations',
    },
  );

  if (!updatedStripeSubscription) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Stripe subscription update failed',
    );
  }

  // ---------------- Preview Upcoming Invoice (Proration) ----------------
  const invoice = await stripe.invoices.retrieveUpcoming({
    customer: updatedStripeSubscription.customer as string,
    subscription: updatedStripeSubscription.id,
  });

  const prorationAmount = (invoice.total || 0) / 100;

  // ---------------- Update MongoDB Subscription ----------------
  const updateData = {
    packageId: newPackageId,
    amount: prorationAmount,
    time: newPlan.interval,
    startDate: new Date(invoice.period_start * 1000),
    endDate: new Date(invoice.period_end * 1000),
    status: 'Completed',
  };

  const updatedSub = await Subscription.findByIdAndUpdate(
    subscription._id,
    updateData,
    { new: true },
  );

  return updatedSub;
};

const getAllSubs = async (query: Record<string, unknown>) => {
  const { page, limit } = query;

  const anyConditions: any[] = [];

  const whereConditions =
    anyConditions.length > 0 ? { $and: anyConditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Subscription.find(whereConditions)
    .populate('userId', 'name email image')
    .populate('packageId', 'name unitAmount interval')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await Subscription.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

export const SubscriptionService = {
  createCheckoutSession,
  handleStripeWebhookService,
  updateExpiredSubscriptions,
  getMySubscriptions,
  updateSubscriptionPlanService,
  getAllSubs,
};
