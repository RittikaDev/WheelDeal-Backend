import QueryBuilder from '../../builder/QueryBuilder';

import { ICar } from './car.interface';
import { CarModel } from './car.model';
import { searchableFields } from './car.constants';

const createCarIntoDB = async (car: ICar) => {
  const result = await CarModel.create(car);
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
  // const parsedCarData = CarValidationSchema.createCarValidationSchema
  //   .partial()
  //   .parse(updateCarData);

  const result = await CarModel.findByIdAndUpdate(
    { _id: carId },
    updateCarData,
    { new: true, runValidators: true },
  );
  return result;
};

const deleteACarFromDB = async (id: string) => {
  const result = await CarModel.deleteOne({ _id: id });
  return result;
};

export const CarService = {
  createCarIntoDB,
  getAllCarsFromDB,
  getSingleCarFromDB,
  updateACarIntoDB,
  deleteACarFromDB,
};
