// Vercel Serverless Function - tRPC API Handler
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '../server/routers.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log(`[API] ${req.method} ${req.url}`);
  
  // Health check
  if (req.url === '/api/health') {
    return res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  }

  // Convert Vercel request to Fetch API Request
  const url = new URL(req.url || '', `https://${req.headers.host}`);
  
  // Create fetch Request object
  const fetchRequest = new Request(url.toString(), {
    method: req.method,
    headers: new Headers(req.headers as Record<string, string>),
    body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
  });

  try {
    // Handle tRPC request using fetch adapter
    const response = await fetchRequestHandler({
      endpoint: '/api/trpc',
      req: fetchRequest,
      router: appRouter,
      createContext: async () => {
        // Simple context without Express dependencies
        return {
          user: null, // Will be populated by auth middleware in procedures
        };
      },
    });

    // Convert fetch Response to Vercel response
    const body = await response.text();
    const headers: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    res.status(response.status);
    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    res.send(body);
  } catch (error) {
    console.error('[API] Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
