const express = require('express');
const isReachable = require('is-reachable');
const proxy = require('http-proxy-middleware');

const PROXY_REACHABLE_TIMEOUT = 30 * 1000; // 30 seconds

// do not include trailing slashes
const PROXY_DESTINATIONS = {
  '/api': 'http://0.0.0.0:3001',
  '/cases': 'http://0.0.0.0:3002',
  '/documents': 'http://0.0.0.0:3004',
  '/sections': 'http://0.0.0.0:3006',
  '/trial-sessions': 'http://0.0.0.0:3007',
  '/users': 'http://0.0.0.0:3003',
  '/work-items': 'http://0.0.0.0:3005',
};

const proxyMain = async () => {
  const app = express();

  Object.entries(PROXY_DESTINATIONS).forEach(([uri, target]) => {
    const pathRewrite = {};
    // e.g. ^/api/foo becomes /foo
    pathRewrite[`^${uri}`] = '';
    app.use(
      uri,
      proxy({
        pathRewrite,
        target,
      }),
    );
  });

  app.listen(3000, '0.0.0.0');

  const isProxyReachable = uri => {
    // hitting '/TEST/PROXY' to deliberately elicit a 404 rather than 403 which clutters authorization logs
    return isReachable(`${uri}/TEST/PROXY`, {
      timeout: PROXY_REACHABLE_TIMEOUT,
    });
  };

  await Promise.all(Object.values(PROXY_DESTINATIONS).map(isProxyReachable));
};

proxyMain();
