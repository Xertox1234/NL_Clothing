"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
/**
 * Authentication Routes
 * -------------------
 * Handles user login, registration, and token verification
 */
const zod_1 = require("zod");
const router_1 = require("../router");
const auth_1 = require("../auth");
const server_1 = require("@trpc/server");
exports.authRouter = (0, router_1.router)({
    /**
     * Register a new user
     */
    register: router_1.publicProcedure
        .input(zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(8),
        name: zod_1.z.string().optional(),
    }))
        .mutation(async ({ input, ctx }) => {
        const { email, password, name } = input;
        const { prisma } = ctx;
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new server_1.TRPCError({
                code: 'CONFLICT',
                message: 'User with this email already exists',
            });
        }
        // Hash password
        const passwordHash = await (0, auth_1.hashPassword)(password);
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
        const token = (0, auth_1.generateToken)({
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
    login: router_1.publicProcedure
        .input(zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string(),
    }))
        .mutation(async ({ input, ctx }) => {
        const { email, password } = input;
        const { prisma } = ctx;
        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user || !user.passwordHash) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found or invalid credentials',
            });
        }
        // Compare password
        const isPasswordValid = await (0, auth_1.comparePassword)(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new server_1.TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Invalid credentials',
            });
        }
        // Generate token
        const token = (0, auth_1.generateToken)({
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
    verify: router_1.publicProcedure
        .input(zod_1.z.object({
        token: zod_1.z.string(),
    }))
        .query(async ({ input }) => {
        try {
            // This will throw if token is invalid, caught by tRPC error formatter
            const decoded = await import('../auth').then(m => m.verifyToken(input.token));
            return {
                valid: true,
                user: decoded,
            };
        }
        catch (error) {
            return {
                valid: false,
                user: null,
            };
        }
    }),
});
