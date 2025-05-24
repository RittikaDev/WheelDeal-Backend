import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CouponService } from './coupon.service';
import httpStatus from 'http-status-codes';

const createCoupon = catchAsync(async (req, res) => {
  const coupon = await CouponService.createCoupon(req.body, req?.user?.id);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Coupon created successfully',
    data: coupon,
  });
});
const applyCoupon = catchAsync(async (req, res) => {
  console.log('Applying coupon with body:', req.body);

  const validatedCode: string = req.body.code;
  const validatedCarIds: string[] = req.body.carIds; // Expect an array now

  if (
    !validatedCode ||
    !Array.isArray(validatedCarIds) ||
    validatedCarIds.length === 0
  ) {
    throw new Error('Coupon code and at least one car ID are required.');
  }

  const coupon = await CouponService.applyCoupon(
    validatedCode,
    validatedCarIds,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon applied successfully',
    data: coupon,
  });
});

const getCoupons = catchAsync(async (req, res) => {
  const coupons = await CouponService.getAllCoupons();
  res.json({ success: true, coupons });
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Coupon retrieved successfully',
    data: coupons,
  });
});

const updateCoupon = catchAsync(async (req, res) => {
  const couponId = req.params.id;

  const updatedCoupon = await CouponService.updateCoupon(couponId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon updated successfully',
    data: updatedCoupon,
  });
});

export const CouponController = {
  createCoupon,
  applyCoupon,
  getCoupons,
  updateCoupon,
};
