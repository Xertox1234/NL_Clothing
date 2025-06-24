"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
/**
 * Product Routes
 * -------------
 * Handles product listing, details, and admin CRUD operations
 */
const zod_1 = require("zod");
const router_1 = require("../router");
const server_1 = require("@trpc/server");
exports.productRouter = (0, router_1.router)({
    /**
     * Get all products with pagination and filters
     */
    getAllProducts: router_1.publicProcedure
        .input(zod_1.z.object({
        skip: zod_1.z.number().min(0).default(0),
        take: zod_1.z.number().min(1).max(100).default(12),
        search: zod_1.z.string().optional(),
        minPrice: zod_1.z.number().optional(),
        maxPrice: zod_1.z.number().optional(),
        sortBy: zod_1.z.enum(['price_asc', 'price_desc', 'newest', 'name_asc']).optional(),
    }))
        .query(async ({ input, ctx }) => {
        const { prisma } = ctx;
        const { skip, take, search, minPrice, maxPrice, sortBy } = input;
        // Build filter conditions
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined)
                where.price.gte = minPrice;
            if (maxPrice !== undefined)
                where.price.lte = maxPrice;
        }
        // Build sort conditions
        let orderBy = { createdAt: 'desc' };
        if (sortBy) {
            switch (sortBy) {
                case 'price_asc':
                    orderBy = { price: 'asc' };
                    break;
                case 'price_desc':
                    orderBy = { price: 'desc' };
                    break;
                case 'newest':
                    orderBy = { createdAt: 'desc' };
                    break;
                case 'name_asc':
                    orderBy = { name: 'asc' };
                    break;
            }
        }
        // Get products
        const products = await prisma.product.findMany({
            where,
            orderBy,
            skip,
            take,
        });
        // Get total count for pagination
        const total = await prisma.product.count({ where });
        return {
            products,
            total,
        };
    }),
    /**
     * Get a single product by ID
     */
    getProductById: router_1.publicProcedure
        .input(zod_1.z.object({
        id: zod_1.z.string(),
    }))
        .query(async ({ input, ctx }) => {
        const { prisma } = ctx;
        const { id } = input;
        const product = await prisma.product.findUnique({
            where: { id },
        });
        if (!product) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'Product not found',
            });
        }
        return product;
    }),
    /**
     * Admin: Create a new product
     */
    createProduct: router_1.adminProcedure
        .input(zod_1.z.object({
        name: zod_1.z.string().min(1),
        description: zod_1.z.string().min(1),
        price: zod_1.z.number().positive(),
        imageUrl: zod_1.z.string().url().optional(),
    }))
        .mutation(async ({ input, ctx }) => {
        const { prisma } = ctx;
        const { name, description, price, imageUrl } = input;
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price,
                imageUrl,
            },
        });
        return product;
    }),
    /**
     * Admin: Update a product
     */
    updateProduct: router_1.adminProcedure
        .input(zod_1.z.object({
        id: zod_1.z.string(),
        name: zod_1.z.string().min(1).optional(),
        description: zod_1.z.string().min(1).optional(),
        price: zod_1.z.number().positive().optional(),
        imageUrl: zod_1.z.string().url().optional(),
    }))
        .mutation(async ({ input, ctx }) => {
        const { prisma } = ctx;
        const { id, ...data } = input;
        // Check if product exists
        const exists = await prisma.product.findUnique({
            where: { id },
        });
        if (!exists) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'Product not found',
            });
        }
        const product = await prisma.product.update({
            where: { id },
            data,
        });
        return product;
    }),
    /**
     * Admin: Delete a product
     */
    deleteProduct: router_1.adminProcedure
        .input(zod_1.z.object({
        id: zod_1.z.string(),
    }))
        .mutation(async ({ input, ctx }) => {
        const { prisma } = ctx;
        const { id } = input;
        // Check if product exists
        const exists = await prisma.product.findUnique({
            where: { id },
        });
        if (!exists) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'Product not found',
            });
        }
        // Check if product is in any orders
        const orderItems = await prisma.orderItem.findFirst({
            where: { productId: id },
        });
        if (orderItems) {
            throw new server_1.TRPCError({
                code: 'BAD_REQUEST',
                message: 'Cannot delete product that is part of existing orders',
            });
        }
        await prisma.product.delete({
            where: { id },
        });
        return { success: true };
    }),
});
