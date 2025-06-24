/**
 * Authentication Routes
 * -------------------
 * Handles user login, registration, and token verification
 */
import { z } from 'zod';
import { router, publicProcedure } from '../router';
import { comparePassword, generateToken, hashPassword } from '../auth';
import { TRPCError } from '@trpc/server';

export const authRouter = router({
  /**
   * Register a new user
   */
  register: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string().min(8),
      name: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { email, password, name } = input;
      const { prisma } = ctx;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User with this email already exists',
        });
      }

      // Hash password
      const passwordHash = await hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name,
          role: 'CUSTOMER', // Default role for new users
        },
      });

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    }),

  /**
   * Login a user
   */
  login: publicProcedure
    .input(z.object({
      email: z.string().email(),
      password: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      const { prisma } = ctx;

      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user || !user.passwordHash) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found or invalid credentials',
        });
      }

      // Compare password
      const isPasswordValid = await comparePassword(password, user.passwordHash);

      if (!isPasswordValid) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Invalid credentials',
        });
      }

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    }),

  /**
   * Verify a token is valid
   */
  verify: publicProcedure
    .input(z.object({
      token: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        // This will throw if token is invalid, caught by tRPC error formatter
        const decoded = await import('../auth').then(m => m.verifyToken(input.token));
        
        return {
          valid: true,
          user: decoded,
        };
      } catch (error) {
        return {
          valid: false,
          user: null,
        };
      }
    }),
});
