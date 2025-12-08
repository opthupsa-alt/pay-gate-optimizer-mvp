/**
 * PayGate Optimizer - Custom Server
 * ==================================
 * هذا الملف للاستضافة المشتركة مع cPanel
 * This file is for shared hosting with cPanel
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Environment
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

// Create Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🚀 PayGate Optimizer is running!               ║
║                                                   ║
║   Mode: ${dev ? 'Development' : 'Production'}                           ║
║   URL:  http://${hostname}:${port}                      ║
║                                                   ║
║   Admin Login:                                    ║
║   📧 admin@paygate.com                            ║
║   🔑 admin123                                     ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
      `);
    });
});

