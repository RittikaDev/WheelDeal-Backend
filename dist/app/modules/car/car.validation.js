"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarValidationSchema = void 0;
const zod_1 = require("zod");
const createCarValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Car name is required'),
        description: zod_1.z.string().min(1, 'Description is required'),
        image: zod_1.z.string().url('Invalid image URL').min(1, 'Image URL is required'),
        brand: zod_1.z.string().min(1, 'Brand is required'),
        model: zod_1.z.string().min(1, 'Model is required'),
        type: zod_1.z.string().min(1, 'Type is required'),
        category: zod_1.z.string().min(1, 'Category is required'),
        year: zod_1.z
            .number()
            .int()
            .min(1900, 'Year must be a valid year')
            .max(new Date().getFullYear(), 'Year cannot be in the future'),
        color: zod_1.z.string().min(1, 'Color is required'),
        seatCapacity: zod_1.z.number().int().min(1, 'Seat capacity is required'),
        isElectric: zod_1.z.boolean().default(false),
        moreImages: zod_1.z
            .array(zod_1.z.object({
            url: zod_1.z
                .string()
                .url('Invalid gallery image URL')
                .min(1, 'Gallery image URL is required'),
        }))
            .default([]),
        features: zod_1.z.array(zod_1.z.string()).default([]),
        transmission: zod_1.z.enum(['automatic', 'manual']),
        status: zod_1.z.enum(['available', 'unavailable']).default('available'),
        stock: zod_1.z.number().int().min(0, 'Stock is required'),
        isDeleted: zod_1.z.boolean().default(false),
    }),
});
const updateCarValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, 'Car name is required').optional(),
        description: zod_1.z.string().min(1, 'Description is required').optional(),
        image: zod_1.z
            .string()
            .url('Invalid image URL')
            .min(1, 'Image URL is required')
            .optional(),
        brand: zod_1.z.string().min(1, 'Brand is required').optional(),
        model: zod_1.z.string().min(1, 'Model is required').optional(),
        type: zod_1.z.string().min(1, 'Type is required').optional(),
        category: zod_1.z.string().min(1, 'Category is required').optional(),
        year: zod_1.z
            .number()
            .int()
            .min(1900, 'Year must be a valid year')
            .max(new Date().getFullYear(), 'Year cannot be in the future')
            .optional(),
        color: zod_1.z.string().min(1, 'Color is required').optional(),
        seatCapacity: zod_1.z
            .number()
            .int()
            .min(1, 'Seat capacity is required')
            .optional(),
        isElectric: zod_1.z.boolean().default(false).optional(),
        moreImages: zod_1.z
            .array(zod_1.z.object({
            url: zod_1.z
                .string()
                .url('Invalid gallery image URL')
                .min(1, 'Gallery image URL is required'),
        }))
            .default([])
            .optional(),
        features: zod_1.z.array(zod_1.z.string()).default([]).optional(),
        status: zod_1.z
            .enum(['available', 'unavailable'])
            .default('available')
            .optional(),
        stock: zod_1.z.number().int().min(0, 'Stock is required').optional(),
        isDeleted: zod_1.z.boolean().default(false).optional(),
    }),
});
exports.CarValidationSchema = {
    createCarValidationSchema,
    updateCarValidationSchema,
};
