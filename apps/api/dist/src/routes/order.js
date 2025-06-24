"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
/**
 * Order Routes
 * -----------
 * Handles order creation, customer order history, and admin order management
 */
const zod_1 = require("zod");
const server_1 = require("@trpc/server");
const router_1 = require("../router");
exports.orderRouter = (0, router_1.router)({
    /**
     * Customer: Create a new order
     */
    createOrder: router_1.protectedProcedure
        .input(zod_1.z.object({
        items: zod_1.z.array(zod_1.z.object({
            productId: zod_1.z.string(),
            quantity: zod_1.z.number().int().positive(),
        })),
    }))
        .mutation(async ({ input, ctx }) => {
        const { prisma, user } = ctx;
        const { items } = input;
        // Validate all products exist and get their prices
        const productIds = items.map((item) => item.productId);
        const products = await prisma.product.findMany({
            where: {
                id: { in: productIds },
            },
        });
        // Check if all products were found
        if (products.length !== productIds.length) {
            throw new server_1.TRPCError({
                code: 'BAD_REQUEST',
                message: 'One or more products not found',
            });
        }
        // Create a map of product id to price for easier lookup
        const productPriceMap = products.reduce((map, product) => {
            map[product.id] = product.price;
            return map;
        }, {});
        // Calculate order total
        const total = items.reduce((sum, item) => {
            const price = productPriceMap[item.productId] || 0;
            return sum + (price * item.quantity);
        }, 0);
        // Create order with items
        const order = await prisma.order.create({
            data: {
                userId: user.userId,
                total,
                status: 'pending',
                items: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: productPriceMap[item.productId] || 0,
                    })),
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        return order;
    }),
    /**
     * Customer: Get own orders
     */
    getMyOrders: router_1.protectedProcedure
        .input(zod_1.z.object({
        skip: zod_1.z.number().min(0).default(0),
        take: zod_1.z.number().min(1).max(100).default(10),
    }))
        .query(async ({ input, ctx }) => {
        const { prisma, user } = ctx;
        const { skip, take } = input;
        const orders = await prisma.order.findMany({
            where: {
                userId: user.userId,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take,
        });
        const total = await prisma.order.count({
            where: {
                userId: user.userId,
            },
        });
        return {
            orders,
            total,
        };
    }),
    /**
     * Customer: Get order details
     */
    getOrderById: router_1.protectedProcedure
        .input(zod_1.z.object({
        id: zod_1.z.string(),
    }))
        .query(async ({ input, ctx }) => {
        const { prisma, user } = ctx;
        const { id } = input;
        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!order) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'Order not found',
            });
        }
        // Verify ownership unless admin
        if (order.userId !== user.userId && user.role !== 'ADMIN') {
            throw new server_1.TRPCError({
                code: 'FORBIDDEN',
                message: 'You do not have access to this order',
            });
        }
        return order;
    }),
    /**
     * Admin: Get all orders with filtering
     */
    getAllOrders: router_1.adminProcedure
        .input(zod_1.z.object({
        skip: zod_1.z.number().min(0).default(0),
        take: zod_1.z.number().min(1).max(100).default(10),
        userId: zod_1.z.string().optional(),
        status: zod_1.z.string().optional(),
        fromDate: zod_1.z.string().datetime().optional(),
        toDate: zod_1.z.string().datetime().optional(),
    }))
        .query(async ({ input, ctx }) => {
        const { prisma } = ctx;
        const { skip, take, userId, status, fromDate, toDate } = input;
        // Build filter conditions
        const where = {};
        if (userId) {
            where.userId = userId;
        }
        if (status) {
            where.status = status;
        }
        if (fromDate || toDate) {
            where.createdAt = {};
            if (fromDate)
                where.createdAt.gte = new Date(fromDate);
            if (toDate)
                where.createdAt.lte = new Date(toDate);
        }
        const orders = await prisma.order.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take,
        });
        const total = await prisma.order.count({ where });
        return {
            orders,
            total,
        };
    }),
    /**
     * Admin: Update order status
     */
    updateOrderStatus: router_1.adminProcedure
        .input(zod_1.z.object({
        id: zod_1.z.string(),
        status: zod_1.z.string(),
    }))
        .mutation(async ({ input, ctx }) => {
        const { prisma } = ctx;
        const { id, status } = input;
        const order = await prisma.order.update({
            where: { id },
            data: {
                status,
            },
            include: {
                items: true,
            },
        });
        return order;
    }),
});
