import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IOrder } from '../order/order.interface';
import { Order } from '../order/order.model';
import { sendNotifications } from '../../../helpers/notificationHelper';

const createOrderConfirmationToDB = async (id: string, payload: IOrder) => {
  const isExistOrder = await Order.findById(id);
  if (!isExistOrder) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  if (isExistOrder.paymentStatus !== 'paid') {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Order is not paid');
  }

  const updated = await Order.findByIdAndUpdate(
    id,
    { deliveryStatus: payload.deliveryStatus },
    { new: true }
  );

  if (updated) {
    await sendNotifications({
      text: `Order ${updated.orderId} has been ${updated.deliveryStatus}`,
      receiver: updated.userId,
    });
  }

  return updated;
};

export const OrderConfirmationService = {
  createOrderConfirmationToDB,
};
