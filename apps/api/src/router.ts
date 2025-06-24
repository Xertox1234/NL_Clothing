/**
 * tRPC Router Definition
 * ---------------------
 * Main router that combines all sub-routers
 */
import { initTRPC } from '@trpc/server';
import { Context } from './context';
import { ZodError } from 'zod';

import { userRouter } from './routes/user';
import { productRouter } from './routes/product';
import { orderRouter } from './routes/order';
import { authRouter } from './routes/auth';

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// Export reusable router and procedure builders
export const router = t.router;
export const publicProcedure = t.procedure;

// Create middleware for protected routes
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new Error('Not authenticated');
  }
  return next({
    ctx: {
      // Add user data to downstream resolvers
      user: ctx.user,
    },
  });
});

// Export protected procedure
export const protectedProcedure = t.procedure.use(isAuthed);

// Create admin middleware
const isAdmin = t.middleware(({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== 'ADMIN') {
    throw new Error('Admin access required');
  }
  return next({
    ctx: {
      user: ctx.user,
    },
  });
});

// Export admin procedure
export const adminProcedure = t.procedure.use(isAdmin);

// Create application router with all sub-routes
export const appRouter = router({
  auth: authRouter,
  user: userRouter,
  product: productRouter,
  order: orderRouter,
});

export type AppRouter = typeof appRouter;
