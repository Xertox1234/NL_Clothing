/**
 * User Routes
 * ----------
 * Handles user profile management and admin user operations
 */
import { z } from 'zod';
import { router, protectedProcedure, adminProcedure } from '../router';
import { hashPassword } from '../auth';
import { TRPCError } from '@trpc/server';

export const userRouter = router({
  /**
   * Get current user profile
   */
  me: protectedProcedure
    .query(async ({ ctx }) => {
      const { prisma, user } = ctx;
      
      const userData = await prisma.user.findUnique({
        where: { id: user.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      
      if (!userData) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }
      
      return userData;
    }),
  
  /**
   * Update current user profile
   */
  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      currentPassword: z.string().optional(),
      newPassword: z.string().min(8).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { prisma, user } = ctx;
      const { name, email, currentPassword, newPassword } = input;
      
      // Get current user data to verify password
      const userData = await prisma.user.findUnique({
        where: { id: user.userId },
      });
      
      if (!userData) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }
      
      // Handle password update
      let passwordHash = undefined;
      
      if (newPassword && currentPassword) {
        if (!userData.passwordHash) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Cannot update password - no password set',
          });
        }
        
        const isPasswordValid = await import('../auth').then(m => 
          m.comparePassword(currentPassword, userData.passwordHash || '')
        );
        
        if (!isPasswordValid) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Current password is incorrect',
          });
        }
        
        passwordHash = await hashPassword(newPassword);
      }
      
      // Check if email already exists
      if (email && email !== userData.email) {
        const emailExists = await prisma.user.findUnique({
          where: { email },
        });
        
        if (emailExists) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Email already in use',
          });
        }
      }
      
      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: user.userId },
        data: {
          name: name ?? undefined,
          email: email ?? undefined,
          passwordHash: passwordHash ?? undefined,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      
      return updatedUser;
    }),
  
  /**
   * Admin: Get all users
   */
  getAllUsers: adminProcedure
    .input(z.object({
      skip: z.number().min(0).default(0),
      take: z.number().min(1).max(100).default(10),
    }))
    .query(async ({ input, ctx }) => {
      const { prisma } = ctx;
      const { skip, take } = input;
      
      const users = await prisma.user.findMany({
        skip,
        take,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      const total = await prisma.user.count();
      
      return {
        users,
        total,
      };
    }),
  
  /**
   * Admin: Update user role
   */
  updateUserRole: adminProcedure
    .input(z.object({
      userId: z.string(),
      role: z.enum(['ADMIN', 'CUSTOMER']),
    }))
    .mutation(async ({ input, ctx }) => {
      const { prisma, user } = ctx;
      const { userId, role } = input;
      
      // Prevent self-demotion for admins
      if (userId === user.userId && role !== 'ADMIN') {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Cannot demote yourself from admin',
        });
      }
      
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          role,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });
      
      return updatedUser;
    }),
});
