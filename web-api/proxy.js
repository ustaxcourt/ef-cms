/* eslint-disable no-console */
const express = require('express');
const isReachable = require('is-reachable');
const { createProxyMiddleware } = require('http-proxy-middleware');

// https://github.com/chimurai/http-proxy-middleware#options

const PROXY_REACHABLE_TIMEOUT = 30 * 1000; // 30 seconds
const PROXY_HOST = 'localhost';
const PROXY_PORT = 3000;
const LOG_LEVEL = 'info'; // ['debug', 'info', 'warn', 'error', 'silent']. Default: 'info'

// do not include trailing slashes
const PROXY_DESTINATIONS = {
  '/notifications': `http://${PROXY_HOST}:3011`,
  '/public-api': `http://${PROXY_HOST}:3013`,
  '/streams': `http://${PROXY_HOST}:3012`,
};

const proxyMain = async () => {
  const pathRewrite = {};
  const router = {};

  Object.entries(PROXY_DESTINATIONS).forEach(([path, destination]) => {
    pathRewrite[`^${path}`] = '';
    router[`${PROXY_HOST}:${PROXY_PORT}${path}`] = destination;
  });

  if (LOG_LEVEL == 'debug') {
    console.log('Path Rewrites', pathRewrite);
    console.log('Router:', router);
  }

  const proxyObj = createProxyMiddleware('**', {
    headers: {
      Connection: 'keep-alive',
    },
    logLevel: LOG_LEVEL,
    pathRewrite,
    router,
    target: `http://${PROXY_HOST}:1234`,
  });

  const app = express();
  app.use('/', proxyObj);

  app.listen(PROXY_PORT);

  const isProxyReachable = uri => {
    // hitting '/TEST/PROXY' to deliberately elicit a 404 rather than 403 which clutters authorization logs
    return isReachable(`${uri}/TEST/PROXY`, {
      timeout: PROXY_REACHABLE_TIMEOUT,
    });
  };

  await Promise.all(Object.values(PROXY_DESTINATIONS).map(isProxyReachable));
};

proxyMain();
