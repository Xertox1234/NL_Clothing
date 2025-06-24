/**
 * tRPC context creation
 * ---------------------
 * Creates a context for each request, including Prisma client and authentication
 */
import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from './auth';

// Create a single instance of Prisma Client
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

/**
 * Creates context for tRPC requests
 */
export async function createContext({ req, res }: CreateFastifyContextOptions) {
  // Get authorization header
  const authHeader = req.headers.authorization;
  let user = null;

  // If auth header exists, verify token
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      user = await verifyToken(token);
    } catch (error) {
      // Invalid token - do nothing, user remains null
    }
  }

  return {
    req,
    res,
    prisma,
    user,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
