const config = require('./webpack.config.lambda');

module.exports = {
  ...config,
  entry: {
    'reindex-status':
      './web-api/workflow-terraform/migration-cron/main/lambdas/reindex-status.js',
  },
  externals: ['aws-sdk'],
  output: {
    clean: true,
    libraryTarget: 'umd',
    path:
      __dirname +
      '/web-api/workflow-terraform/migration-cron/main/lambdas/dist',
  },
};
