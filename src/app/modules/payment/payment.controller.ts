import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import { stripe } from '../../../shared/stripe';
import config from '../../../config';

const createCheckoutSessionController = async (req: Request, res: Response) => {
  const userId: string = req.user.id;
  const email: string = req.user.email;

  const value: any = {
    userId,
    email,
    orderId: req.body.orderId,
  };

  try {
    const sessionUrl = await PaymentService.createCheckoutSessionService(value);
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
      config.payment.stripe_webhook_secret_payment as string
    );

    await PaymentService.handleStripeWebhookService(event);

    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Payment webhook error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

export const PaymentController = {
  createCheckoutSessionController,
  stripeWebhookController,
};
