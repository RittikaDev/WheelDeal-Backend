import { ICouponCreate } from './coupon.interface';
import CouponModel from './coupon.model';

const createCoupon = async (data: ICouponCreate, adminId: string) => {
  const coupon = await CouponModel.create({ ...data, createdBy: adminId });
  return await coupon.save();
};

const applyCoupon = async (code: string, carIds: string[]) => {
  const upperCode = code.toUpperCase();

  const coupon = await CouponModel.findOne({
    code: upperCode,
    carId: { $in: carIds },
  });

  if (!coupon)
    throw new Error('Coupon not valid for any of the selected cars.');

  if (new Date() > new Date(coupon.expiryDate))
    throw new Error('Coupon has expired.');

  return {
    code: coupon.code,
    discountAmount: coupon.discountAmount,
    discountType: coupon.discountType,
    expiryDate: coupon.expiryDate,
    appliedToCarId: coupon.carId, // the car this coupon is matched with
  };
};

const getAllCoupons = async () => {
  return await CouponModel.find().populate('carId').sort({ createdAt: -1 });
};

const updateCoupon = async (id: string, data: Partial<ICouponCreate>) => {
  const updated = await CouponModel.findByIdAndUpdate(id, data, { new: true });

  if (!updated) throw new Error('Coupon not found');

  return updated;
};

export const CouponService = {
  createCoupon,
  applyCoupon,
  getAllCoupons,
  updateCoupon,
};
