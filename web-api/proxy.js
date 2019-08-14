const express = require('express');
const isReachable = require('is-reachable');
const proxy = require('http-proxy-middleware');

const PROXY_REACHABLE_TIMEOUT = 30 * 1000; // 30 seconds

// do not include trailing slashes
const PROXY_DESTINATIONS = {
  '/api': 'http://localhost:3001',
  '/cases': 'http://localhost:3002',
  '/documents': 'http://localhost:3004',
  '/sections': 'http://localhost:3006',
  '/trial-sessions': 'http://localhost:3007',
  '/users': 'http://localhost:3003',
  '/work-items': 'http://localhost:3005',
};

const proxyMain = async () => {
  const app = express();
  const headers = {
    Connection: 'keep-alive',
  };

  Object.entries(PROXY_DESTINATIONS).forEach(([uri, target]) => {
    const pathRewrite = {};
    // e.g. ^/api/foo becomes /foo
    pathRewrite[`^${uri}`] = '';
    app.use(
      uri,
      proxy({
        headers,
        logLevel: 'debug',
        pathRewrite,
        proxyTimeout: 30 * 1000,
        target,
      }),
    );
  });

  app.listen(3000, 'localhost');

  const isProxyReachable = uri => {
    // hitting '/TEST/PROXY' to deliberately elicit a 404 rather than 403 which clutters authorization logs
    return isReachable(`${uri}/TEST/PROXY`, {
      timeout: PROXY_REACHABLE_TIMEOUT,
    });
  };

  await Promise.all(Object.values(PROXY_DESTINATIONS).map(isProxyReachable));
};

proxyMain();
