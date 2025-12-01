// Vercel Serverless Function - tRPC API Handler
import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { appRouter } from '../server/routers.ts';
import { createContext } from '../server/_core/context.ts';

// Create Express app for serverless
const app = express();

// Configure body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// tRPC middleware
app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Export handler for Vercel
export default app;
