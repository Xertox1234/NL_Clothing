/**
 * Next Level Clothing API Server
 * ------------------------------
 * Fastify server with tRPC for type-safe API endpoints
 */
import { fastify } from 'fastify';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import cors from '@fastify/cors';
import { createContext } from './src/context';
import { appRouter } from './src/router';
import { env } from './src/env';

// Initialize Fastify server
const server = fastify({
  maxParamLength: 5000,
  logger: {
    level: env.NODE_ENV === 'development' ? 'info' : 'error'
  }
});

// Register CORS plugin for cross-domain requests
server.register(cors, {
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
server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: { router: appRouter, createContext }
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
    message: env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : error.message
  });
});

// Start the server
const start = async () => {
  try {
    const port = parseInt(env.PORT || '4000', 10);
    const host = env.HOST || '0.0.0.0';
    
    await server.listen({ port, host });
    console.log(`API server listening at http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

// Start the server if this file is run directly
if (require.main === module) {
  start();
}

// Export for testing
export { server, appRouter };
export type AppRouter = typeof appRouter;