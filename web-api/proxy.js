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

app.listen(3000);
