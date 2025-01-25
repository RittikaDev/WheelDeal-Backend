import { CarModel } from '../car/car.model';

import OrderModel from './order.model';
import { orderUtils } from './order.utils';

import AppError from '../../errors/AppError';

import httpStatus from 'http-status-codes';
import { User } from '../user/user.model';
import { JwtPayload } from 'jsonwebtoken';

const createOrder = async (
  user: JwtPayload,
  payload: { products: { product: string; quantity: number }[] },
  client_ip: string,
) => {
  if (!payload?.products?.length)
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Order is not specified');

  const products = payload.products;

  let totalPrice = 0;
  const productDetails = await Promise.all(
    products.map(async (item) => {
      const product = await CarModel.findById(item.product);
      if (product) {
        const subtotal = product ? (product.price || 0) * item.quantity : 0;
        totalPrice += subtotal;
        return item;
      }
    }),
  );

  const userDetails = await User.findOne({ email: user.userEmail });

  let order = await OrderModel.create({
    user: userDetails?._id,
    products: productDetails,
    totalPrice,
  });

  // payment integration
  const shurjopayPayload = {
    amount: totalPrice,
    order_id: order._id,
    currency: 'BDT',
    customer_name: userDetails?.name,
    customer_address: userDetails?.address,
    customer_email: userDetails?.email,
    customer_phone: userDetails?.phone,
    customer_city: userDetails?.city,
    client_ip,
  };
  // console.log('inside order service', shurjopayPayload);

  const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

  // console.log(payment);

  if (payment?.transactionStatus) {
    order = await order.updateOne({
      transaction: {
        id: payment.sp_order_id,
        transactionStatus: payment.transactionStatus,
      },
    });
  }

  return payment.checkout_url;
};

export const calculateTotalRevenue = async () => {
  // MongoDB AGGREGATION PIPELINE
  const revenueData = await OrderModel.aggregate([
    {
      $lookup: {
        from: 'cars', // REFERENCE TO 'CARS' COLLECTION
        localField: 'car', // FIELD OF THE ORDER COLLECTION THAT IS REFERENCING THE CAR COLLECTION
        foreignField: '_id',
        as: 'carDetails',
      },
    },
    {
      $unwind: '$carDetails', // EXPECTING ONLY ONE MATCH, THAT'S WHY $unwind
    },
    {
      $match: {
        'carDetails.quantity': { $gt: 0 }, // CAR QUANTITY HAS TO BE MORE THAT 0
      },
    },
    {
      $project: {
        totalRevenue: {
          $multiply: ['$quantity', '$carDetails.price'],
        },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalRevenue' },
      },
    },
  ]);

  return revenueData[0] ? revenueData[0].totalRevenue : 0;
};

export const OrderService = {
  createOrder,
  calculateTotalRevenue,
};
