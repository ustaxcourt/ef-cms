var express = require('express');
var proxy = require('http-proxy-middleware');

var app = express();

app.use(
  '/api',
  proxy({
    pathRewrite: {
      '^/api': '/',
    },
    target: 'http://localhost:3001',
  }),
);

app.use(
  '/cases',
  proxy({
    pathRewrite: {
      '^/cases': '/',
    },
    target: 'http://localhost:3002',
  }),
);

app.use(
  '/users',
  proxy({
    pathRewrite: {
      '^/users': '/',
    },
    target: 'http://localhost:3003',
  }),
);

app.use(
  '/documents',
  proxy({
    pathRewrite: {
      '^/documents': '/',
    },
    target: 'http://localhost:3004',
  }),
);

app.use(
  '/work-items',
  proxy({
    pathRewrite: {
      '^/work-items': '/',
    },
    target: 'http://localhost:3005',
  }),
);

app.use(
  '/sections',
  proxy({
    pathRewrite: {
      '^/sections': '/',
    },
    target: 'http://localhost:3006',
  }),
);

app.listen(3000);
