/**
 * Fulfillment API Server
 * 
 * Express server that receives orders from the frontend
 * and auto-fulfills them via Puppeteer/Codashop BD.
 * 
 * Endpoints:
 *   POST /api/fulfill     — Process a single order
 *   POST /api/batch       — Process multiple orders
 *   GET  /api/prices/:app — Get current BD prices for an app
 *   GET  /api/health      — Health check
 * 
 * Run: npx ts-node src/automation/server.ts
 * Or:  node --loader ts-node/esm src/automation/server.ts
 */

import http from 'node:http';
import { fulfillOrder, processBatch, checkBDPrices, healthCheck, closeBrowser } from './fulfillment.js';
import type { FulfillmentOrder } from './fulfillment.js';

const PORT = parseInt(process.env['FULFILLMENT_PORT'] || '3001', 10);

// ─── Simple HTTP Server (no Express dependency needed) ───────────────────────

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://localhost:${PORT}`);
  const method = req.method?.toUpperCase();

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    // ─── POST /api/fulfill ─────────────────────────────────────────────
    if (method === 'POST' && url.pathname === '/api/fulfill') {
      const body = await readBody(req);
      const order = JSON.parse(body) as FulfillmentOrder;

      if (!order.orderId || !order.app || !order.userId || !order.diamonds) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Missing required fields: orderId, app, userId, diamonds' }));
        return;
      }

      console.log(`\n📦 New order: ${order.orderId} | ${order.app} | ${order.diamonds}D | User: ${order.userId}`);
      const result = await fulfillOrder(order);
      
      res.writeHead(result.success ? 200 : 500);
      res.end(JSON.stringify(result));
      return;
    }

    // ─── POST /api/batch ───────────────────────────────────────────────
    if (method === 'POST' && url.pathname === '/api/batch') {
      const body = await readBody(req);
      const orders = JSON.parse(body) as FulfillmentOrder[];

      if (!Array.isArray(orders) || orders.length === 0) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Request body must be a non-empty array of orders' }));
        return;
      }

      console.log(`\n📦 Batch: ${orders.length} orders`);
      const results = await processBatch(orders);
      
      const successCount = results.filter((r) => r.success).length;
      res.writeHead(200);
      res.end(JSON.stringify({ total: results.length, success: successCount, failed: results.length - successCount, results }));
      return;
    }

    // ─── GET /api/prices/:app ──────────────────────────────────────────
    if (method === 'GET' && url.pathname.startsWith('/api/prices/')) {
      const app = url.pathname.split('/').pop() || '';
      
      if (!['imo', 'bigo', 'likee', 'tiktok', 'yalla'].includes(app)) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid app. Supported: imo, bigo, likee, tiktok, yalla' }));
        return;
      }

      console.log(`\n💰 Price check: ${app}`);
      const prices = await checkBDPrices(app);
      
      res.writeHead(200);
      res.end(JSON.stringify({ app, prices, checkedAt: new Date().toISOString() }));
      return;
    }

    // ─── GET /api/health ───────────────────────────────────────────────
    if (method === 'GET' && url.pathname === '/api/health') {
      const health = await healthCheck();
      res.writeHead(health.ok ? 200 : 503);
      res.end(JSON.stringify(health));
      return;
    }

    // ─── 404 ───────────────────────────────────────────────────────────
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found', endpoints: ['POST /api/fulfill', 'POST /api/batch', 'GET /api/prices/:app', 'GET /api/health'] }));

  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal server error' }));
  }
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readBody(req: http.IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: Buffer) => { data += chunk.toString(); });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

// ─── Start Server ────────────────────────────────────────────────────────────

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║  💎 Diamond Fulfillment Server                   ║
║  Running on http://localhost:${PORT}              ║
║                                                  ║
║  Endpoints:                                      ║
║  POST /api/fulfill  — Fulfill single order       ║
║  POST /api/batch    — Fulfill batch of orders    ║
║  GET  /api/prices/:app — Check BD prices         ║
║  GET  /api/health   — Health check               ║
╚══════════════════════════════════════════════════╝
  `);
});

// ─── Graceful Shutdown ───────────────────────────────────────────────────────

process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  await closeBrowser();
  server.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeBrowser();
  server.close();
  process.exit(0);
});
