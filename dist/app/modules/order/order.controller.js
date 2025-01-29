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
exports.OrderController = void 0;
const order_service_1 = require("./order.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        res.status(401).json({
            success: false,
            message: 'User is not authenticated',
        });
    else {
        const order = yield order_service_1.OrderService.createOrder(user, req.body, req.ip);
        (0, sendResponse_1.default)(res, {
            statusCode: http_status_codes_1.default.CREATED,
            success: true,
            message: 'Order placed successfully',
            data: order,
        });
    }
}));
const verifyPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req);
    const order = yield order_service_1.OrderService.verifyPayment(req.query.order_id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: 'Order verified successfully',
        data: order,
    });
}));
const getAllOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newQuery = Object.assign({}, req.query);
    // modify the endTime field to filter the non returned bookings
    if (req.query.endTime) {
        delete newQuery.endTime;
        newQuery.endTime = null;
    }
    const { paginationMetaData, result } = yield order_service_1.OrderService.getAllOrders(newQuery);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_codes_1.default.OK,
        message: 'Bookings retrieved successfully',
        paginationMetaData,
        data: result,
    });
}));
const getUserOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newQuery = Object.assign({}, req.query);
    // modify the endTime field to filter the non returned bookings
    if (req.query.endTime) {
        delete newQuery.endTime;
        newQuery.endTime = null;
    }
    const { paginationMetaData, result } = yield order_service_1.OrderService.getUserOrders(req.user, newQuery);
    if (result.length === 0)
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_codes_1.default.NOT_FOUND,
            message: 'No bookings found under this user',
            paginationMetaData,
            data: result,
        });
    else
        (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_codes_1.default.OK,
            message: 'Bookings retrieved successfully',
            paginationMetaData,
            data: result,
        });
}));
const cancelOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const updatedOrder = yield order_service_1.OrderService.cancelOrder(orderId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: 'Order placed successfully',
        data: updatedOrder,
    });
}));
const updateOrderStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const { status, deliveryDate } = req.body;
    const parsedDeliveryDate = deliveryDate ? new Date(deliveryDate) : null;
    const updatedOrder = yield order_service_1.OrderService.updateOrderStatus(orderId, status, parsedDeliveryDate === null || parsedDeliveryDate === void 0 ? void 0 : parsedDeliveryDate.toString());
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.CREATED,
        success: true,
        message: 'Order placed successfully',
        data: updatedOrder,
    });
}));
const deleteSelectedOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderId } = req.params;
    const result = yield order_service_1.OrderService.deleteSelectedOrder(orderId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: 'Car deleted successfully',
        data: result,
    });
}));
exports.OrderController = {
    createOrder,
    verifyPayment,
    getAllOrders,
    getUserOrders,
    cancelOrder,
    updateOrderStatus,
    deleteSelectedOrder,
};
