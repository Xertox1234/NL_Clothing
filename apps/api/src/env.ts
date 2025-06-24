/**
 * Type-safe environment variable handling
 */
import { z } from 'zod';
import 'dotenv/config';

// Define schema for environment variables
const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.string().default('4000'),
  HOST: z.string().default('0.0.0.0'),
  JWT_SECRET: z.string().min(1),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  SENTRY_DSN: z.string().optional(),
});

// Parse environment variables
const _env = envSchema.safeParse(process.env);

// Handle validation errors
if (!_env.success) {
  console.error(
    '❌ Invalid environment variables:',
    _env.error.format()
  );
  throw new Error('Invalid environment variables');
}

// Export validated env
export const env = _env.data;
