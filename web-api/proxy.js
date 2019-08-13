const express = require('express');
const proxy = require('http-proxy-middleware');

const app = express();

// do not include trailing slashes
const proxyDestinations = {
  '/api': 'http://localhost:3001',
  '/cases': 'http://localhost:3002',
  '/documents': 'http://localhost:3004',
  '/sections': 'http://localhost:3006',
  '/trial-sessions': 'http://localhost:3007',
  '/users': 'http://localhost:3003',
  '/work-items': 'http://localhost:3005',
};

Object.entries(proxyDestinations).forEach(([uri, target]) => {
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

app.listen(3000);
