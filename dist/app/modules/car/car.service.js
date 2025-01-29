"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarService = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const car_model_1 = require("./car.model");
const car_constants_1 = require("./car.constants");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const createCarIntoDB = (car) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.CarModel.create(car);
    return result;
});
// MINIMIZING THE DATA TRANSFERRED FROM THE SERVER AND REDUCES LATENCY BY ONLY FETCHING FIRST 8 FOR HOME PAGE TO HAVE QUICK LOAD TIME
const getFeaturedCarsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.CarModel.find().sort({ createdAt: -1 }).limit(6).exec();
    return result;
});
const getAllCarsFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const carQuery = new QueryBuilder_1.default(car_model_1.CarModel.find({}), query)
        .filter()
        .sort()
        .paginate()
        .fields()
        .search(car_constants_1.searchableFields);
    const result = yield carQuery.modelQuery;
    const paginationMetaData = yield carQuery.countTotal();
    return { result, paginationMetaData };
});
const getCarBrandCatModel = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.CarModel.aggregate([
        { $project: { brand: 1, category: 1, model: 1 } }, // Include the fields for projection
        {
            $group: {
                _id: { brand: '$brand', category: '$category', model: '$model' },
            },
        }, // Group by the distinct combination of brand, category, and model
        { $limit: 6 }, // Limit the results to 6 distinct combinations
    ]);
    return result.map((item) => item._id);
});
const getSingleCarFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_model_1.CarModel.findOne({ _id: id }); // SEARCHING BY THE MONGODB _ID
    // console.log(result);
    return result;
});
const updateACarIntoDB = (carId, updateCarData) => __awaiter(void 0, void 0, void 0, function* () {
    // FETCH THE CAR FROM THE DATABASE TO CHECK ITS CURRENT STATUS
    const existingCar = yield car_model_1.CarModel.findById(carId);
    if (!existingCar)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Car not found!');
    // CHECK IF THE CAR'S STATUS IS "AVAILABLE"
    if (existingCar.status !== 'available' && existingCar.stock <= 0)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Cannot update car. No longer available');
    // PROCEED WITH THE UPDATE
    const result = yield car_model_1.CarModel.findByIdAndUpdate(carId, updateCarData, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteACarFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isProductExists = yield car_model_1.CarModel.findById(id);
    if (!isProductExists)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Car does not exist');
    const deletedCar = yield car_model_1.CarModel.findByIdAndDelete(id);
    return deletedCar;
});
// const deleteACarFromDB = async (id: string) => {
//   const isProductExists = await CarModel.findById(id);
//   if (!isProductExists)
//     throw new AppError(httpStatus.BAD_REQUEST, 'Car does not exist');
//   const deletedCar = await CarModel.findByIdAndUpdate(
//     id,
//     { isDeleted: true, status: 'unavailable', stock: 0 },
//     {
//       new: true,
//       runValidators: true,
//     },
//   );
//   return deletedCar;
// };
exports.CarService = {
    createCarIntoDB,
    getFeaturedCarsFromDB,
    getCarBrandCatModel,
    getAllCarsFromDB,
    getSingleCarFromDB,
    updateACarIntoDB,
    deleteACarFromDB,
};
