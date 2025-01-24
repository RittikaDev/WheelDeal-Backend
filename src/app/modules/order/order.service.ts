import { CarModel } from '../car/car.model';
import { OrderModel } from './order.model';

const createOrder = async (orderData: {
  email: string;
  car: string;
  quantity: number;
  totalPrice: number;
}) => {
  // CHECKING IF CAR EXISTS
  const car = await CarModel.findById(orderData.car);

  if (!car) throw new Error('Car not found');

  if (car.stock < orderData.quantity) {
    throw new Error('Insufficient stock available');
  }

  // REDUCING THE CAR QUANTITY EACH TIME AN ORDER IS PLACED
  car.stock -= orderData.quantity;

  // IF quantity = 0 THEN, inStock WILL BE false
  if (car.stock === 0) car.status = 'unavailable';

  await car.save(); // SAVE CAR

  const newOrder = new OrderModel({
    email: orderData.email,
    car: orderData.car,
    quantity: orderData.quantity,
    totalPrice: orderData.totalPrice,
  });

  await newOrder.save(); // SAVE ORDER

  return newOrder;
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
