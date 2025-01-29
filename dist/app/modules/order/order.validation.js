"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderValidationSchema = void 0;
const zod_1 = require("zod");
const CreateOrderValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        car: zod_1.z.string(),
        quantity: zod_1.z.number().int().positive(),
        totalPrice: zod_1.z.number().positive(),
    }),
});
const updateOrderValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email().optional(), // Optional email
        car: zod_1.z.string().optional(), // Optional car field
        quantity: zod_1.z.number().int().positive().optional(), // Optional positive quantity
        totalPrice: zod_1.z.number().positive().optional(), // Optional positive total price
    }),
});
exports.OrderValidationSchema = {
    CreateOrderValidationSchema,
    updateOrderValidationSchema,
};
