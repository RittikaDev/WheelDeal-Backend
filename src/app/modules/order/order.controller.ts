import { Request, Response } from 'express';

import { OrderService } from './order.service';

import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import httpStatus from 'http-status-codes';

const createOrder = catchAsync(async (req, res) => {
  const user = req.user;

  if (!user)
    res.status(401).json({
      success: false,
      message: 'User is not authenticated',
    });
  else {
    const order = await OrderService.createOrder(user, req.body, req.ip!);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  }
});

const verifyPayment = catchAsync(async (req, res) => {
  console.log(req);
  const order = await OrderService.verifyPayment(req.query.order_id as string);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Order verified successfully',
    data: order,
  });
});

const getAllOrders = catchAsync(async (req, res) => {
  const newQuery = { ...req.query };

  // modify the endTime field to filter the non returned bookings
  if (req.query.endTime) {
    delete newQuery.endTime;
    newQuery.endTime = null as unknown as string;
  }

  const { paginationMetaData, result } =
    await OrderService.getAllOrders(newQuery);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bookings retrieved successfully',
    paginationMetaData,
    data: result,
  });
});

const getUserOrders = catchAsync(async (req, res) => {
  const newQuery = { ...req.query };

  // modify the endTime field to filter the non returned bookings
  if (req.query.endTime) {
    delete newQuery.endTime;
    newQuery.endTime = null as unknown as string;
  }

  const { paginationMetaData, result } = await OrderService.getUserOrders(
    req.user!,
    newQuery,
  );
  if (result.length === 0)
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.NOT_FOUND,
      message: 'No bookings found under this user',
      paginationMetaData,
      data: result,
    });
  else
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Bookings retrieved successfully',
      paginationMetaData,
      data: result,
    });
});

const getRevenue = catchAsync(async (req: Request, res: Response) => {
  const totalRevenue = await OrderService.calculateTotalRevenue();

  if (totalRevenue === 0) {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: false,
      message: 'Revenue is 0, no sales recorded.',
      data: [],
    });
  } else
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: false,
      message: 'Revenue calculated successfully',
      data: {
        totalRevenue: totalRevenue,
      },
    });
});

export const OrderController = {
  createOrder,
  verifyPayment,
  getAllOrders,
  getUserOrders,
  getRevenue,
};
