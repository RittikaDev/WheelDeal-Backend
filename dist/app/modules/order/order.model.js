"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const OrderSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    products: [
        {
            product: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Car',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    transaction: {
        id: { type: String },
        transactionStatus: { type: String },
        bank_status: { type: String },
        sp_code: { type: String },
        sp_message: { type: String },
        method: { type: String }, // E.g., 'SurjoPay', 'Credit Card', etc.
        date_time: { type: Date }, // Store this as a proper Date
    },
    isPaid: { type: Boolean, default: false },
    cancelledAt: { type: Date },
    updatedStatus: { type: String }, // For tracking status changes
    deliveryDate: { type: String },
}, {
    timestamps: true,
});
const OrderModel = (0, mongoose_1.model)('Order', OrderSchema);
exports.default = OrderModel;
