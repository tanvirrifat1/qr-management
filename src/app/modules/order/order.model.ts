import { model, Schema } from 'mongoose';
import { IOrder } from './order.interface';

// const orderSchema = new Schema<IOrder>(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true,
//     },
//     items: [
//       {
//         productId: {
//           type: Schema.Types.ObjectId,
//           ref: 'Product',
//           required: true,
//         },
//         quantity: {
//           type: Number,
//           required: true,
//         },
//         price: {
//           type: Number,
//           required: true,
//         },
//         sellerId: {
//           type: Schema.Types.ObjectId,
//           ref: 'User',
//           required: true,
//         },
//       },
//     ],
//     paymentStatus: {
//       type: String,
//       enum: ['paid', 'pending'],
//       default: 'pending',
//     },
//     deliveryStatus: {
//       type: String,
//       enum: ['placed', 'preparing', 'in_transit', 'delivered'],
//       default: 'placed',
//     },

//     orderId: {
//       type: String,
//       required: true,
//     },
//     area: {
//       type: String,
//       required: true,
//     },
//     city: {
//       type: String,
//       required: true,
//     },
//     zip: {
//       type: Number,
//       required: true,
//     },
//     state: {
//       type: String,
//       required: true,
//     },
//     country: {
//       type: String,
//       required: false,
//     },
//     firstName: {
//       type: String,
//       required: true,
//     },
//     lastName: {
//       type: String,
//       required: true,
//     },
//     streetName: {
//       type: String,
//       required: true,
//     },
//     billingAddress: {
//       type: String,
//       required: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export const Order = model<IOrder>('Order', orderSchema);

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ['paid', 'pending'],
      default: 'pending',
    },
    deliveryStatus: {
      type: String,
      enum: ['placed', 'preparing', 'in_transit', 'delivered'],
      default: 'placed',
    },

    orderId: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zip: {
      type: Number,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    streetName: {
      type: String,
      required: true,
    },
    billingAddress: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
    },
    size: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = model<IOrder>('Order', orderSchema);
