const config = require('./webpack.config.lambda');

module.exports = {
  ...config,
  entry: {
    'switch-colors-status':
      './web-api/switch-colors-cron-terraform/main/lambdas/switch-colors.js',
  },
  externals: ['aws-sdk'],
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: __dirname + '/web-api/switch-colors-cron-terraform/main/lambdas/dist',
  },
};
