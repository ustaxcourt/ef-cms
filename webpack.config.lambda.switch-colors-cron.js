const config = require('./webpack.config.lambda');

module.exports = {
  ...config,
  entry: {
    'reindex-status':
      './web-api/colors-switch-cron-terraform/main/lambdas/switch-colors-status.js',
  },
  externals: ['aws-sdk'],
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: __dirname + '/web-api/switch-colors-cron-terraform/main/lambdas/dist',
  },
};
