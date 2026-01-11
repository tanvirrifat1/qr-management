import cors from 'cors';
import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import router from './routes';
import { Morgan } from './shared/morgen';
import { SubscriptionController } from './app/modules/subscription/subscription.controller';
import cron from 'node-cron';
import { SubscriptionService } from './app/modules/subscription/subscription.service';
import { PaymentController } from './app/modules/payment/payment.controller';

const app = express();

//morgan
app.use(Morgan.successHandler);
app.use(Morgan.errorHandler);
app.use(express.urlencoded({ extended: true }));

//body parser

app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);

// Stripe webhooks FIRST
app.post(
  '/payment',
  express.raw({ type: 'application/json' }),
  PaymentController.stripeWebhookController
);

// webhook
app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  SubscriptionController.stripeWebhookController
);

// CRON Jobs
cron.schedule('* * * * *', async () => {
  try {
    await Promise.all([SubscriptionService.updateExpiredSubscriptions()]);
  } catch (err: any) {
    console.error('Cron job error:', err.message);
  }
});
app.use(express.json());

//file retrieve
app.use(express.static('uploads'));

//router
app.use('/api/v1', router);

//live response
app.get('/', (req: Request, res: Response) => {
  res.send(
    '<h1 style="text-align:center; color:#A55FEF; font-family:Verdana;">Hey, How can I assist you today!</h1>'
  );
});

//global error handle
app.use(globalErrorHandler);

//handle not found route;
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: 'Not found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API DOESN'T EXIST",
      },
    ],
  });
});

export default app;
