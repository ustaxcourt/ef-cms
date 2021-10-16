const config = require('./webpack.config.lambda');

module.exports = {
  ...config,
  entry: {
    'reindex-status':
      './web-api/migration-cron-terraform/main/lambdas/reindex-status.js',
  },
  externals: ['aws-sdk'],
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: __dirname + '/web-api/migration-cron-terraform/main/lambdas/dist',
  },
};
