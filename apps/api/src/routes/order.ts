/**
 * Order Routes
 * -----------
 * Handles order creation, customer order history, and admin order management
 */
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, protectedProcedure, adminProcedure } from '../router';

export const orderRouter = router({
  /**
   * Customer: Create a new order
   */
  createOrder: protectedProcedure
    .input(z.object({
      items: z.array(z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
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
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'One or more products not found',
        });
      }
      
      // Create a map of product id to price for easier lookup
      const productPriceMap = products.reduce((map, product) => {
        map[product.id] = product.price;
        return map;
      }, {} as Record<string, number>);
      
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
  getMyOrders: protectedProcedure
    .input(z.object({
      skip: z.number().min(0).default(0),
      take: z.number().min(1).max(100).default(10),
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
  getOrderById: protectedProcedure
    .input(z.object({
      id: z.string(),
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
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Order not found',
        });
      }
      
      // Verify ownership unless admin
      if (order.userId !== user.userId && user.role !== 'ADMIN') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You do not have access to this order',
        });
      }
      
      return order;
    }),
  
  /**
   * Admin: Get all orders with filtering
   */
  getAllOrders: adminProcedure
    .input(z.object({
      skip: z.number().min(0).default(0),
      take: z.number().min(1).max(100).default(10),
      userId: z.string().optional(),
      status: z.string().optional(),
      fromDate: z.string().datetime().optional(),
      toDate: z.string().datetime().optional(),
    }))
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { skip, take, userId, status, fromDate, toDate } = input;
      
      // Build filter conditions
      const where: any = {};
      
      if (userId) {
        where.userId = userId;
      }
      
      if (status) {
        where.status = status;
      }
      
      if (fromDate || toDate) {
        where.createdAt = {};
        if (fromDate) where.createdAt.gte = new Date(fromDate);
        if (toDate) where.createdAt.lte = new Date(toDate);
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
  updateOrderStatus: adminProcedure
    .input(z.object({
      id: z.string(),
      status: z.string(),
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
