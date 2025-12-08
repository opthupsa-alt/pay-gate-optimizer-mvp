/**
 * PayGate Optimizer - Production Server
 * =====================================
 * For cPanel / Shared Hosting with Node.js
 */

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const hostname = process.env.HOST || '0.0.0.0';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ 
  dev: false, 
  hostname, 
  port,
  dir: __dirname 
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
    .once('error', (err) => {
      console.error('Server Error:', err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`PayGate Optimizer running at http://${hostname}:${port}`);
    });
});

