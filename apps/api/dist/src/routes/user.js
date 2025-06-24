"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
/**
 * User Routes
 * ----------
 * Handles user profile management and admin user operations
 */
const zod_1 = require("zod");
const router_1 = require("../router");
const auth_1 = require("../auth");
const server_1 = require("@trpc/server");
exports.userRouter = (0, router_1.router)({
    /**
     * Get current user profile
     */
    me: router_1.protectedProcedure
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
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found',
            });
        }
        return userData;
    }),
    /**
     * Update current user profile
     */
    updateProfile: router_1.protectedProcedure
        .input(zod_1.z.object({
        name: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        currentPassword: zod_1.z.string().optional(),
        newPassword: zod_1.z.string().min(8).optional(),
    }))
        .mutation(async ({ input, ctx }) => {
        const { prisma, user } = ctx;
        const { name, email, currentPassword, newPassword } = input;
        // Get current user data to verify password
        const userData = await prisma.user.findUnique({
            where: { id: user.userId },
        });
        if (!userData) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found',
            });
        }
        // Handle password update
        let passwordHash = undefined;
        if (newPassword && currentPassword) {
            if (!userData.passwordHash) {
                throw new server_1.TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Cannot update password - no password set',
                });
            }
            const isPasswordValid = await import('../auth').then(m => m.comparePassword(currentPassword, userData.passwordHash || ''));
            if (!isPasswordValid) {
                throw new server_1.TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Current password is incorrect',
                });
            }
            passwordHash = await (0, auth_1.hashPassword)(newPassword);
        }
        // Check if email already exists
        if (email && email !== userData.email) {
            const emailExists = await prisma.user.findUnique({
                where: { email },
            });
            if (emailExists) {
                throw new server_1.TRPCError({
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
    getAllUsers: router_1.adminProcedure
        .input(zod_1.z.object({
        skip: zod_1.z.number().min(0).default(0),
        take: zod_1.z.number().min(1).max(100).default(10),
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
    updateUserRole: router_1.adminProcedure
        .input(zod_1.z.object({
        userId: zod_1.z.string(),
        role: zod_1.z.enum(['ADMIN', 'CUSTOMER']),
    }))
        .mutation(async ({ input, ctx }) => {
        const { prisma, user } = ctx;
        const { userId, role } = input;
        // Prevent self-demotion for admins
        if (userId === user.userId && role !== 'ADMIN') {
            throw new server_1.TRPCError({
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
