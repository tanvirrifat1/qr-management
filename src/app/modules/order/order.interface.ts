import { Types } from 'mongoose';

// export type IOrder = {
//   userId: Types.ObjectId;
//   items: Array<{
//     productId: string;
//     quantity: number;
//     price: number;
//     sellerId: Types.ObjectId;
//   }>;
//   deliveryStatus: 'placed' | 'preparing' | 'in_transit' | 'delivered';
//   paymentStatus: 'paid' | 'pending';
//   orderId: string;
//   firstName: string;
//   lastName: string;
//   streetName: string;
//   area: string;
//   city: string;
//   zip: number;
//   state: string;
//   country?: string;
//   billingAddress: string;
// };

export type IOrder = {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  price: number;
  sellerId: Types.ObjectId;
  deliveryStatus: 'placed' | 'preparing' | 'in_transit' | 'delivered';
  paymentStatus: 'paid' | 'pending';
  orderId: string;
  firstName: string;
  lastName: string;
  streetName: string;
  area: string;
  city: string;
  zip: number;
  state: string;
  country?: string;
  billingAddress: string;
};
