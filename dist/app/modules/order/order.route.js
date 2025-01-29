"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRoute = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constant_1 = require("../auth/auth.constant");
const router = express_1.default.Router();
// router.post('/', auth(USER_ROLE.user), OrderController.createOrder);
router
    .route('/')
    .post((0, auth_1.default)(auth_constant_1.USER_ROLE.user), order_controller_1.OrderController.createOrder)
    .get((0, auth_1.default)(auth_constant_1.USER_ROLE.admin), order_controller_1.OrderController.getAllOrders);
router.get('/verify', (0, auth_1.default)(auth_constant_1.USER_ROLE.user), order_controller_1.OrderController.verifyPayment);
router.get('/my-bookings', (0, auth_1.default)(auth_constant_1.USER_ROLE.user), order_controller_1.OrderController.getUserOrders);
router.patch('/cancel-order/:orderId', (0, auth_1.default)(auth_constant_1.USER_ROLE.user), order_controller_1.OrderController.cancelOrder);
router.delete('/:orderId/delete-order', (0, auth_1.default)(auth_constant_1.USER_ROLE.admin), order_controller_1.OrderController.deleteSelectedOrder);
router.patch('/:orderId/status', (0, auth_1.default)(auth_constant_1.USER_ROLE.admin), order_controller_1.OrderController.updateOrderStatus);
exports.OrderRoute = router;
