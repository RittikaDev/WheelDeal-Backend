import { CarModel } from '../car/car.model';

import OrderModel from './order.model';
import { orderUtils } from './order.utils';

import { User } from '../user/user.model';

import AppError from '../../errors/AppError';
import QueryBuilder from '../../builder/QueryBuilder';

import httpStatus from 'http-status-codes';
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
        if (product.stock < item.quantity) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'Product is stock out, can not place an order',
          );
        }
        const subtotal = product ? (product.price || 0) * item.quantity : 0;
        totalPrice += subtotal;

        product.stock -= item.quantity;
        product.status = 'unavailable';
        await product.save();

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

const verifyPayment = async (order_id: string) => {
  const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

  if (verifiedPayment.length) {
    await OrderModel.findOneAndUpdate(
      {
        'transaction.id': order_id,
      },
      {
        'transaction.bank_status': verifiedPayment[0].bank_status,
        'transaction.sp_code': verifiedPayment[0].sp_code,
        'transaction.sp_message': verifiedPayment[0].sp_message,
        'transaction.transactionStatus': verifiedPayment[0].transaction_status,
        'transaction.method': verifiedPayment[0].method,
        'transaction.date_time': verifiedPayment[0].date_time,
        status:
          verifiedPayment[0].bank_status == 'Success'
            ? 'Shipped'
            : verifiedPayment[0].bank_status == 'Failed'
              ? 'Pending'
              : verifiedPayment[0].bank_status == 'Cancel'
                ? 'Cancelled'
                : '',
      },
    );
  }

  return verifiedPayment;
};

// GET ALL ORDERS : ADMIN
const getAllOrders = async (query: Record<string, unknown>) => {
  const orderQuery = new QueryBuilder(
    OrderModel.find({}).populate('user').populate('products.product'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await orderQuery.modelQuery;
  const paginationMetaData = await orderQuery.countTotal();

  return { result, paginationMetaData };
};

// USER SPECIFIC ORDERS
const getUserOrders = async (
  userData: JwtPayload,
  query: Record<string, unknown>,
) => {
  const user = await User.findOne({ email: userData.userEmail });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  const userBookingQuery = new QueryBuilder(
    OrderModel.find({ user: user._id })
      .populate('user')
      .populate('products.product'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userBookingQuery.modelQuery;
  const paginationMetaData = await userBookingQuery.countTotal();

  return { result, paginationMetaData };
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
  verifyPayment,
  getAllOrders,
  getUserOrders,
  calculateTotalRevenue,
};
