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
      success: false,
      message: 'Order placed successfully',
      data: order,
    });
  }
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
  getRevenue,
};
