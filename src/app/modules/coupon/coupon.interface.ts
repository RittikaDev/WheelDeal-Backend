import { Types } from 'mongoose';

export interface ICoupon extends ICouponCreate {
  carId: Types.ObjectId;
  createdBy?: Types.ObjectId;
}

export interface ICouponCreate {
  code: string;
  discountAmount: number;
  discountType: 'flat' | 'percentage';
  expiryDate: Date;
}
