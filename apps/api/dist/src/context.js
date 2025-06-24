"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = createContext;
const client_1 = require("@prisma/client");
const auth_1 = require("./auth");
// Create a single instance of Prisma Client
const prisma = new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
/**
 * Creates context for tRPC requests
 */
async function createContext({ req, res }) {
    // Get authorization header
    const authHeader = req.headers.authorization;
    let user = null;
    // If auth header exists, verify token
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
            user = await (0, auth_1.verifyToken)(token);
        }
        catch (error) {
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
