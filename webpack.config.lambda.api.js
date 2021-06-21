const config = require('./webpack.config.lambda');

module.exports = {
  ...config,
  entry: {
    api: './web-api/terraform/template/lambdas/api.js',
    'api-public': './web-api/terraform/template/lambdas/api-public.js',
    'cognito-authorizer':
      './web-api/terraform/template/lambdas/cognito-authorizer.js',
    'cognito-triggers':
      './web-api/terraform/template/lambdas/cognito-triggers.js',
    cron: './web-api/terraform/template/lambdas/cron.js',
    streams: './web-api/terraform/template/lambdas/streams.js',
    websockets: './web-api/terraform/template/lambdas/websockets.js',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: __dirname + '/web-api/terraform/template/lambdas/dist',
  },
};
