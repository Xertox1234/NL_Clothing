/**
 * Authentication utilities
 * -----------------------
 * JWT token generation and verification
 */
import { sign, verify } from 'jsonwebtoken';
import { compare, hash } from 'bcryptjs';
import { z } from 'zod';
import { env } from './env';
import { TRPCError } from '@trpc/server';

// User data to store in JWT
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Generate JWT token for authenticated user
 */
export function generateToken(payload: JWTPayload): string {
  return sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verify JWT token and return payload
 */
export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const decoded = verify(token, env.JWT_SECRET);
    
    // Validate with zod schema
    const payloadSchema = z.object({
      userId: z.string(),
      email: z.string().email(),
      role: z.string()
    });
    
    return payloadSchema.parse(decoded);
  } catch (error) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Invalid or expired token',
    });
  }
}

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

/**
 * Check if user is authenticated in the context
 * Throws error if not authenticated
 */
export function requireAuth<T>(ctx: T & { user: JWTPayload | null }) {
  if (!ctx.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in',
    });
  }
  return ctx.user;
}

/**
 * Check if user has admin role
 * Throws error if not admin
 */
export function requireAdmin<T>(ctx: T & { user: JWTPayload | null }) {
  const user = requireAuth(ctx);
  if (user.role !== 'ADMIN') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Admin access required',
    });
  }
  return user;
}
