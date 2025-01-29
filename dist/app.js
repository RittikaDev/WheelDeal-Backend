"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
// import { CarRoute } from './app/modules/car/car.route';
// import { OrderRoute } from './app/modules/order/order.route';
const routes_1 = __importDefault(require("./app/routes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const app = (0, express_1.default)();
// PARSERS
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: 'https://wheel-deal-frontend.vercel.app',
    credentials: true,
}));
// ROUTES
// app.use('/api/cars', CarRoute);
// app.use('/api/orders', OrderRoute);
app.use('/api/', routes_1.default);
app.get('/', (req, res) => {
    res.send('Welcome to Car Store api server!');
});
app.use(globalErrorHandler_1.default);
app.use(notFound_1.default);
exports.default = app;
