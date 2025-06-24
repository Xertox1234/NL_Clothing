"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
/**
 * Type-safe environment variable handling
 */
const zod_1 = require("zod");
require("dotenv/config");
// Define schema for environment variables
const envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().min(1),
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.string().default('4000'),
    HOST: zod_1.z.string().default('0.0.0.0'),
    JWT_SECRET: zod_1.z.string().min(1),
    CORS_ORIGIN: zod_1.z.string().default('http://localhost:3000'),
    SENTRY_DSN: zod_1.z.string().optional(),
});
// Parse environment variables
const _env = envSchema.safeParse(process.env);
// Handle validation errors
if (!_env.success) {
    console.error('❌ Invalid environment variables:', _env.error.format());
    throw new Error('Invalid environment variables');
}
// Export validated env
exports.env = _env.data;
