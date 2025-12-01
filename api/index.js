// Vercel Serverless Function Entry Point
// This file adapts the Express server to work as a Vercel serverless function

import('../dist/index.js').then((module) => {
  module.default;
});

export default async function handler(req, res) {
  const { default: app } = await import('../dist/index.js');
  return app(req, res);
}
