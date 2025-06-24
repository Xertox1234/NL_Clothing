/**
 * Product Routes
 * -------------
 * Handles product listing, details, and admin CRUD operations
 */
import { z } from 'zod';
import { router, publicProcedure, adminProcedure } from '../router';
import { TRPCError } from '@trpc/server';

export const productRouter = router({
  /**
   * Get all products with pagination and filters
   */
  getAllProducts: publicProcedure
    .input(z.object({
      skip: z.number().min(0).default(0),
      take: z.number().min(1).max(100).default(12),
      search: z.string().optional(),
      minPrice: z.number().optional(),
      maxPrice: z.number().optional(),
      sortBy: z.enum(['price_asc', 'price_desc', 'newest', 'name_asc']).optional(),
    }))
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { skip, take, search, minPrice, maxPrice, sortBy } = input;
      
      // Build filter conditions
      const where: any = {};
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }
      
      if (minPrice !== undefined || maxPrice !== undefined) {
        where.price = {};
        if (minPrice !== undefined) where.price.gte = minPrice;
        if (maxPrice !== undefined) where.price.lte = maxPrice;
      }
      
      // Build sort conditions
      let orderBy: any = { createdAt: 'desc' };
      
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
  getProductById: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { id } = input;
      
      const product = await prisma.product.findUnique({
        where: { id },
      });
      
      if (!product) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found',
        });
      }
      
      return product;
    }),
  
  /**
   * Admin: Create a new product
   */
  createProduct: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().min(1),
      price: z.number().positive(),
      imageUrl: z.string().url().optional(),
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
  updateProduct: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      price: z.number().positive().optional(),
      imageUrl: z.string().url().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { id, ...data } = input;
      
      // Check if product exists
      const exists = await prisma.product.findUnique({
        where: { id },
      });
      
      if (!exists) {
        throw new TRPCError({
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
  deleteProduct: adminProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { id } = input;
      
      // Check if product exists
      const exists = await prisma.product.findUnique({
        where: { id },
      });
      
      if (!exists) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Product not found',
        });
      }
      
      // Check if product is in any orders
      const orderItems = await prisma.orderItem.findFirst({
        where: { productId: id },
      });
      
      if (orderItems) {
        throw new TRPCError({
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
