import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../auth/auth.constant';
import { CouponController } from './coupon.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CouponValidationSchema } from './coupon.validation';

const router = express.Router();

// ADMIN ROUTES
router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(CouponValidationSchema.CreateCouponSchema),
  CouponController.createCoupon,
);
router.get('/', auth(USER_ROLE.admin), CouponController.getCoupons);
router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(CouponValidationSchema.UpdateCouponSchema),
  CouponController.updateCoupon,
);

// PUBLIC ROUTE
router.post(
  '/apply',
  validateRequest(CouponValidationSchema.ApplyCouponSchema),
  CouponController.applyCoupon,
);

export const CouponRoute = router;
