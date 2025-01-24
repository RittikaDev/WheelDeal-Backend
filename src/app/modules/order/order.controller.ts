import { Request, Response } from 'express';

// import { OrderValidationSchema } from './order.validation';
import { OrderService } from './order.service';

// import { z } from 'zod';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

import httpStatus from 'http-status-codes';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  // VALIDATION USING ZOD
  // const zodOrderData = OrderValidationSchema.CreateOrderValidationSchema.parse(req.body);

  const order = await OrderService.createOrder(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car created successfully',
    data: order,
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

// ----------------------------- BEFORE -------------------------------------------
// const createOrder = async (req: Request, res: Response) => {
//   try {
//     // VALIDATION USING ZOD
//     // const zodOrderData = OrderValidationSchema.CreateOrderValidationSchema.parse(req.body);

//     const order = await OrderService.createOrder(req.body);

//     res.status(201).json({
//       message: 'Order created successfully',
//       status: true,
//       data: order,
//     });
//   } catch (err: unknown) {
//     if (err instanceof z.ZodError) {
//       const errorMsg = err.errors.map((error) => ({
//         path: error.path.join('.'),
//         errorMessage: error.message,
//       }));
//       res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: errorMsg,
//       });
//     } else if (err instanceof Error) {
//       res.status(404).json({
//         success: false,
//         message: 'Car not found',
//       });
//     } else {
//       res.status(500).json({
//         success: false,
//         message: 'An unexpected error occurred',
//       });
//     }
//   }
// };

// const getRevenue = async (req: Request, res: Response) => {
//   try {
//     const totalRevenue = await OrderService.calculateTotalRevenue();

//     // console.log(totalRevenue);

//     if (totalRevenue === 0) {
//       res.status(200).json({
//         message: 'Revenue is 0, no sales recorded.',
//         status: true,
//         data: {
//           totalRevenue: totalRevenue,
//         },
//       });
//     } else
//       res.status(200).json({
//         message: 'Revenue calculated successfully',
//         status: true,
//         data: {
//           totalRevenue: totalRevenue,
//         },
//       });
//   } catch (err: unknown) {
//     if (err instanceof z.ZodError) {
//       const errorMsg = err.errors.map((error) => ({
//         path: error.path.join('.'),
//         errorMessage: error.message,
//       }));

//       res.status(400).json({
//         success: false,
//         message: 'Validation error',
//         errors: errorMsg,
//       });
//     } else {
//       res.status(500).json({
//         success: false,
//         message: 'An error occurred while calculating the total revenue',
//         error: (err as Error).message || 'Unknown error',
//       });
//     }
//   }
// };

export const OrderController = {
  createOrder,
  getRevenue,
};
