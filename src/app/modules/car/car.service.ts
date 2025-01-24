import QueryBuilder from '../../builder/QueryBuilder';

import { ICar } from './car.interface';
import { CarModel } from './car.model';
import { searchableFields } from './car.constants';

import httpStatus from 'http-status-codes';
import AppError from '../../errors/AppError';

const createCarIntoDB = async (car: ICar) => {
  const result = await CarModel.create(car);
  return result;
};

// MINIMIZING THE DATA TRANSFERRED FROM THE SERVER AND REDUCES LATENCY BY ONLY FETCHING FIRST 8 FOR HOME PAGE TO HAVE QUICK LOAD TIME
const getFeaturedCarsFromDB = async () => {
  const result = await CarModel.find().sort({ createdAt: -1 }).limit(8).exec();

  return result;
};

const getAllCarsFromDB = async (query: Record<string, unknown>) => {
  const carQuery = new QueryBuilder(CarModel.find({}), query)
    .filter()
    .sort()
    .paginate()
    .fields()
    .search(searchableFields);

  const result = await carQuery.modelQuery;
  const paginationMetaData = await carQuery.countTotal();

  return { result, paginationMetaData };
};

const getSingleCarFromDB = async (id: string) => {
  const result = await CarModel.findOne({ _id: id }); // SEARCHING BY THE MONGODB _ID
  // console.log(result);
  return result;
};

const updateACarIntoDB = async (
  carId: string,
  updateCarData: Partial<ICar>,
) => {
  // FETCH THE CAR FROM THE DATABASE TO CHECK ITS CURRENT STATUS
  const existingCar = await CarModel.findById(carId);

  if (!existingCar) throw new AppError(httpStatus.NOT_FOUND, 'Car not found!');

  // CHECK IF THE CAR'S STATUS IS "AVAILABLE"
  if (existingCar.status !== 'available' && existingCar.stock <= 0)
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Cannot update car. No longer available',
    );

  // PROCEED WITH THE UPDATE
  const result = await CarModel.findByIdAndUpdate(carId, updateCarData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteACarFromDB = async (id: string) => {
  const isProductExists = await CarModel.findById(id);

  if (!isProductExists)
    throw new AppError(httpStatus.BAD_REQUEST, 'Car does not exist');

  const deletedCar = await CarModel.findByIdAndUpdate(
    id,
    { isDeleted: true, status: 'unavailable', stock: 0 },
    {
      new: true,
      runValidators: true,
    },
  );

  return deletedCar;
};

export const CarService = {
  createCarIntoDB,
  getFeaturedCarsFromDB,
  getAllCarsFromDB,
  getSingleCarFromDB,
  updateACarIntoDB,
  deleteACarFromDB,
};
