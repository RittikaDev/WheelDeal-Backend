import { Schema, model } from 'mongoose';
import { ICoupon } from './coupon.interface';

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    carId: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    discountAmount: {
      type: Number,
      required: true,
    },
    discountType: {
      type: String,
      enum: ['flat', 'percentage'],
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const CouponModel = model<ICoupon>('Coupon', couponSchema);

export default CouponModel;
