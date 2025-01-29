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
exports.CarController = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const car_service_1 = require("./car.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const createACar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_service_1.CarService.createCarIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Car created successfully',
        data: result,
    });
}));
const getFeaturedCars = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_service_1.CarService.getFeaturedCarsFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Featured cars retrieved successfully',
        data: result,
    });
}));
const getCarBrandCatModel = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield car_service_1.CarService.getCarBrandCatModel();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Brand names retrieved successfully',
        data: result,
    });
}));
const getAllCars = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { paginationMetaData, result } = yield car_service_1.CarService.getAllCarsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Cars retrieved successfully',
        paginationMetaData,
        data: result,
    });
}));
const getSingleCar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { carId } = req.params;
    const result = yield car_service_1.CarService.getSingleCarFromDB(carId);
    if (result != null) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.OK,
            success: true,
            message: 'Car retrieved successfully',
            data: result,
        });
    }
    else
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.NOT_FOUND,
            success: false,
            message: 'No Data Found',
            data: [],
        });
}));
const updateACar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { carId } = req.params;
    const updateData = req.body;
    // AT LEAST HAS TO BE PROVIDED
    if (Object.keys(updateData).length === 0) {
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.BAD_REQUEST,
            success: false,
            message: 'At least one field must be provided for update',
            data: [],
        });
        return;
    }
    const result = yield car_service_1.CarService.updateACarIntoDB(carId, updateData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Car updated successfully',
        data: result,
    });
}));
const deleteACar = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { carId } = req.params;
    const result = yield car_service_1.CarService.deleteACarFromDB(carId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Car deleted successfully',
        data: result,
    });
}));
exports.CarController = {
    createACar,
    getFeaturedCars,
    getCarBrandCatModel,
    getAllCars,
    getSingleCar,
    updateACar,
    deleteACar,
};
