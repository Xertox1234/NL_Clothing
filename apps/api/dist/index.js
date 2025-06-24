"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = exports.server = void 0;
/**
 * Next Level Clothing API Server
 * ------------------------------
 * Fastify server with tRPC for type-safe API endpoints
 */
const fastify_1 = require("fastify");
const fastify_2 = require("@trpc/server/adapters/fastify");
const cors_1 = __importDefault(require("@fastify/cors"));
const context_1 = require("./src/context");
const router_1 = require("./src/router");
Object.defineProperty(exports, "appRouter", { enumerable: true, get: function () { return router_1.appRouter; } });
const env_1 = require("./src/env");
// Initialize Fastify server
const server = (0, fastify_1.fastify)({
    maxParamLength: 5000,
    logger: {
        level: env_1.env.NODE_ENV === 'development' ? 'info' : 'error'
    }
});
exports.server = server;
// Register CORS plugin for cross-domain requests
server.register(cors_1.default, {
    origin: (origin, cb) => {
        // Allow requests from frontend domain & localhost during development
        const allowedDomains = [
            'http://localhost:3000',
            'https://next-level-clothing.vercel.app'
        ];
        if (!origin || allowedDomains.includes(origin)) {
            cb(null, true);
            return;
        }
        cb(new Error('Not allowed by CORS'), false);
    },
    credentials: true
});
// Register tRPC plugin
server.register(fastify_2.fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: router_1.appRouter, createContext: context_1.createContext }
});
// Health check endpoint
server.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
});
// Error handling
server.setErrorHandler((error, request, reply) => {
    server.log.error(error);
    reply.status(500).send({
        error: 'Internal Server Error',
        message: env_1.env.NODE_ENV === 'production'
            ? 'Something went wrong'
            : error.message
    });
});
// Start the server
const start = async () => {
    try {
        const port = parseInt(env_1.env.PORT || '4000', 10);
        const host = env_1.env.HOST || '0.0.0.0';
        await server.listen({ port, host });
        console.log(`API server listening at http://${host}:${port}`);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
// Start the server if this file is run directly
if (require.main === module) {
    start();
}
