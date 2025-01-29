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
exports.OrderService = void 0;
const car_model_1 = require("../car/car.model");
const order_model_1 = __importDefault(require("./order.model"));
const order_utils_1 = require("./order.utils");
const user_model_1 = require("../user/user.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const createOrder = (user, 
// payload: { products: { product: string; quantity: number }[] },
payload, client_ip) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    if (!((_a = payload === null || payload === void 0 ? void 0 : payload.products) === null || _a === void 0 ? void 0 : _a.length))
        throw new AppError_1.default(http_status_codes_1.default.NOT_ACCEPTABLE, 'Order is not specified');
    const products = payload.products;
    let totalPrice = 0;
    const productDetails = yield Promise.all(products.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield car_model_1.CarModel.findById(item.product);
        if (product) {
            if (product.stock < item.quantity) {
                throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Product is stock out, can not place an order');
            }
            const subtotal = product ? (product.price || 0) * item.quantity : 0;
            totalPrice += subtotal;
            product.stock -= item.quantity;
            if (product.stock <= 0)
                product.status = 'unavailable';
            yield product.save();
            return item;
        }
    })));
    const userDetails = yield user_model_1.User.findOne({ email: user.userEmail });
    const address = {
        address: (userDetails === null || userDetails === void 0 ? void 0 : userDetails.address) || ((_b = payload === null || payload === void 0 ? void 0 : payload.address) === null || _b === void 0 ? void 0 : _b.address) || '',
        city: (userDetails === null || userDetails === void 0 ? void 0 : userDetails.city) || ((_c = payload === null || payload === void 0 ? void 0 : payload.address) === null || _c === void 0 ? void 0 : _c.city) || '',
        phone: (userDetails === null || userDetails === void 0 ? void 0 : userDetails.phone) || ((_d = payload === null || payload === void 0 ? void 0 : payload.address) === null || _d === void 0 ? void 0 : _d.phone) || '',
    };
    let order = yield order_model_1.default.create({
        user: userDetails === null || userDetails === void 0 ? void 0 : userDetails._id,
        products: productDetails,
        totalPrice,
    });
    // payment integration
    const shurjopayPayload = {
        amount: totalPrice,
        order_id: order._id,
        currency: 'BDT',
        customer_name: userDetails === null || userDetails === void 0 ? void 0 : userDetails.name,
        customer_address: address === null || address === void 0 ? void 0 : address.address,
        customer_email: userDetails === null || userDetails === void 0 ? void 0 : userDetails.email,
        customer_phone: address === null || address === void 0 ? void 0 : address.phone,
        customer_city: address === null || address === void 0 ? void 0 : address.city,
        client_ip,
    };
    // console.log('inside order service', shurjopayPayload);
    const payment = yield order_utils_1.orderUtils.makePaymentAsync(shurjopayPayload);
    // console.log(payment);
    if (payment === null || payment === void 0 ? void 0 : payment.transactionStatus) {
        order = yield order.updateOne({
            transaction: {
                id: payment.sp_order_id,
                transactionStatus: payment.transactionStatus,
            },
        });
    }
    return payment.checkout_url;
});
const verifyPayment = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedPayment = yield order_utils_1.orderUtils.verifyPaymentAsync(order_id);
    // console.log(verifiedPayment);
    if (verifiedPayment.length) {
        yield order_model_1.default.findOneAndUpdate({
            'transaction.id': order_id,
        }, {
            'transaction.bank_status': verifiedPayment[0].bank_status,
            'transaction.sp_code': verifiedPayment[0].sp_code,
            'transaction.sp_message': verifiedPayment[0].sp_message,
            'transaction.transactionStatus': verifiedPayment[0].transaction_status,
            'transaction.method': verifiedPayment[0].method,
            'transaction.date_time': verifiedPayment[0].date_time,
            status: verifiedPayment[0].bank_status == 'Success'
                ? 'Pending'
                : verifiedPayment[0].bank_status == 'Failed'
                    ? 'Pending'
                    : verifiedPayment[0].bank_status == 'Cancel'
                        ? 'Cancelled'
                        : '',
        });
    }
    return verifiedPayment;
});
// GET ALL ORDERS : ADMIN
const getAllOrders = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const orderQuery = new QueryBuilder_1.default(order_model_1.default.find({}).populate('user').populate('products.product'), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield orderQuery.modelQuery;
    const paginationMetaData = yield orderQuery.countTotal();
    return { result, paginationMetaData };
});
// USER SPECIFIC ORDERS
const getUserOrders = (userData, query) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email: userData.userEmail });
    if (!user)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'User not found');
    const userBookingQuery = new QueryBuilder_1.default(order_model_1.default.find({ user: user._id })
        .populate('user')
        .populate('products.product'), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield userBookingQuery.modelQuery;
    const paginationMetaData = yield userBookingQuery.countTotal();
    return { result, paginationMetaData };
});
const cancelOrder = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.default.findById(orderId);
    if (!order)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Order not found');
    if (order.status === 'Shipped' || order.status === 'Delivered') {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Cannot cancel an order that is already shipped or delivered');
    }
    // Update the status to 'Cancelled'
    order.status = 'Cancelled';
    yield order.save();
    return order;
});
const updateOrderStatus = (orderId, status, deliveryDate) => __awaiter(void 0, void 0, void 0, function* () {
    const validStatuses = [
        'Pending',
        'Processing',
        'Shipped',
        'Delivered',
        'Cancelled',
    ];
    if (!validStatuses.includes(status))
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Invalid status');
    const order = yield order_model_1.default.findById(orderId);
    if (!order)
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, 'Order not found');
    // Update the status and delivery date
    order.status = status;
    if (deliveryDate)
        order.deliveryDate = deliveryDate;
    yield order.save();
    return order;
});
const deleteSelectedOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isOrderExists = yield order_model_1.default.findById(id);
    if (!isOrderExists)
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, 'Order does not exist');
    const deletedOrder = yield order_model_1.default.findByIdAndDelete(id);
    return deletedOrder;
});
exports.OrderService = {
    createOrder,
    verifyPayment,
    getAllOrders,
    getUserOrders,
    cancelOrder,
    updateOrderStatus,
    deleteSelectedOrder,
};
