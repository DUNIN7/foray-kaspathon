/**
 * FORAY API Proxy Server
 * Version: 1.1.0
 * Modified: 2026-02-02T23:55:00Z
 * 
 * Proxies API requests from Cloudflare Tunnel to the local API server.
 * Handles CORS for browser requests.
 * 
 * Changelog:
 *   v1.1.0 (2026-02-02): Added /api/generate-foray endpoint forwarding
 *   v1.0.0: Initial version with /api/analyze-business only
 */

const http = require('http');

// Helper function to proxy requests to backend
function proxyToBackend(req, res, path) {
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    console.log(`Forwarding to backend: ${path}`);
    
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    
    const proxyReq = http.request(options, proxyRes => {
      let data = '';
      proxyRes.on('data', chunk => data += chunk);
      proxyRes.on('end', () => {
        console.log(`Got response from backend for ${path}`);
        res.writeHead(proxyRes.statusCode, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(data);
      });
    });
    
    proxyReq.on('error', err => {
      console.error('Proxy error:', err);
      res.writeHead(500, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(JSON.stringify({error: err.message}));
    });
    
    proxyReq.write(body);
    proxyReq.end();
  });
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // CORS headers for ALL responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // Route POST requests to backend
  if (req.method === 'POST') {
    if (req.url === '/api/analyze-business') {
      proxyToBackend(req, res, '/api/analyze-business');
      return;
    }
    if (req.url === '/api/generate-foray') {
      proxyToBackend(req, res, '/api/generate-foray');
      return;
    }
  }
  
  // Health check
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', proxy: true }));
    return;
  }
  
  // Not found
  res.writeHead(404);
  res.end('Not found');
});

server.listen(3002, () => {
  console.log('Proxy running on http://localhost:3002');
  console.log('Forwarding /api/analyze-business -> localhost:3001');
  console.log('Forwarding /api/generate-foray -> localhost:3001');
});
