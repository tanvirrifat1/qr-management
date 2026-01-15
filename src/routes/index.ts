import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { ProductRoutes } from '../app/modules/product/product.router';
import { CategoryRoutes } from '../app/modules/category/category.route';
import { AdminRoutes } from '../app/modules/admin/admin.route';
import { SubCategoryRoutes } from '../app/modules/subCategory/subCategory.route';
import { BecameASellerRoutes } from '../app/modules/becameASeller/becameASeller.route';
import { PackageRoutes } from '../app/modules/package/package.router';
import { SubscriptionRoutes } from '../app/modules/subscription/subscription.route';
import { ReviewRoutes } from '../app/modules/review/review.route';
import { OrderRoutes } from '../app/modules/order/order.route';
import { AboutRoutes } from '../app/modules/about/about.route';
import { OrderConfirmationRoutes } from '../app/modules/orderConfirmation/orderConfirmation.route';
import { InboxRoutes } from '../app/modules/inbox/inbox.route';
import { MessageRoutes } from '../app/modules/message/message.route';
import { PaymentRoutes } from '../app/modules/payment/payment.route';
import { WalletRoutes } from '../app/modules/wallet/wallet.router';
import { WithdrawRoutes } from '../app/modules/withdrowMoney/withdrowMoney.route';
import { SellerAccountHelthRoutes } from '../app/modules/sellerAccountHelth/sellerAccountHelth.route';
import { AdminAccountHealthRoutes } from '../app/modules/adminAccountHealth/adminAccountHealth.route';
import { WishListRoutes } from '../app/modules/wishlist/wishlist.route';
import { BuyerSupportRoutes } from '../app/modules/buyerSupport/buyerSupport.route';
import { NotificationRoutes } from '../app/modules/notification/notification.route';

const router = express.Router();

const apiRoutes = [
  { path: '/user', route: UserRoutes },
  { path: '/auth', route: AuthRoutes },
  { path: '/product', route: ProductRoutes },
  { path: '/category', route: CategoryRoutes },
  { path: '/admin', route: AdminRoutes },
  { path: '/sub-category', route: SubCategoryRoutes },
  { path: '/became-a-seller', route: BecameASellerRoutes },
  { path: '/package', route: PackageRoutes },
  { path: '/subscription', route: SubscriptionRoutes },
  { path: '/review', route: ReviewRoutes },
  { path: '/order', route: OrderRoutes },
  { path: '/about', route: AboutRoutes },
  { path: '/order-confirmation', route: OrderConfirmationRoutes },
  { path: '/inbox', route: InboxRoutes },
  { path: '/message', route: MessageRoutes },
  { path: '/payment', route: PaymentRoutes },
  { path: '/wallet', route: WalletRoutes },
  { path: '/withdraw', route: WithdrawRoutes },
  { path: '/account-health-response', route: SellerAccountHelthRoutes },
  { path: '/admin-account-health', route: AdminAccountHealthRoutes },
  { path: '/wishlist', route: WishListRoutes },
  { path: '/buyer-support', route: BuyerSupportRoutes },
  { path: '/notification', route: NotificationRoutes },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
