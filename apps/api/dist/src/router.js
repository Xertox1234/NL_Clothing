"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = exports.adminProcedure = exports.protectedProcedure = exports.publicProcedure = exports.router = void 0;
/**
 * tRPC Router Definition
 * ---------------------
 * Main router that combines all sub-routers
 */
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
const user_1 = require("./routes/user");
const product_1 = require("./routes/product");
const order_1 = require("./routes/order");
const auth_1 = require("./routes/auth");
// Initialize tRPC
const t = server_1.initTRPC.context().create({
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError: error.cause instanceof zod_1.ZodError ? error.cause.flatten() : null,
            },
        };
    },
});
// Export reusable router and procedure builders
exports.router = t.router;
exports.publicProcedure = t.procedure;
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
exports.protectedProcedure = t.procedure.use(isAuthed);
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
exports.adminProcedure = t.procedure.use(isAdmin);
// Create application router with all sub-routes
exports.appRouter = (0, exports.router)({
    auth: auth_1.authRouter,
    user: user_1.userRouter,
    product: product_1.productRouter,
    order: order_1.orderRouter,
});
