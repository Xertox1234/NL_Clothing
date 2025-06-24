"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.requireAuth = requireAuth;
exports.requireAdmin = requireAdmin;
/**
 * Authentication utilities
 * -----------------------
 * JWT token generation and verification
 */
const jsonwebtoken_1 = require("jsonwebtoken");
const bcryptjs_1 = require("bcryptjs");
const zod_1 = require("zod");
const env_1 = require("./env");
const server_1 = require("@trpc/server");
/**
 * Generate JWT token for authenticated user
 */
function generateToken(payload) {
    return (0, jsonwebtoken_1.sign)(payload, env_1.env.JWT_SECRET, { expiresIn: '7d' });
}
/**
 * Verify JWT token and return payload
 */
async function verifyToken(token) {
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, env_1.env.JWT_SECRET);
        // Validate with zod schema
        const payloadSchema = zod_1.z.object({
            userId: zod_1.z.string(),
            email: zod_1.z.string().email(),
            role: zod_1.z.string()
        });
        return payloadSchema.parse(decoded);
    }
    catch (error) {
        throw new server_1.TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Invalid or expired token',
        });
    }
}
/**
 * Hash a password
 */
async function hashPassword(password) {
    return (0, bcryptjs_1.hash)(password, 10);
}
/**
 * Compare password with hash
 */
async function comparePassword(password, hashedPassword) {
    return (0, bcryptjs_1.compare)(password, hashedPassword);
}
/**
 * Check if user is authenticated in the context
 * Throws error if not authenticated
 */
function requireAuth(ctx) {
    if (!ctx.user) {
        throw new server_1.TRPCError({
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
function requireAdmin(ctx) {
    const user = requireAuth(ctx);
    if (user.role !== 'ADMIN') {
        throw new server_1.TRPCError({
            code: 'FORBIDDEN',
            message: 'Admin access required',
        });
    }
    return user;
}
