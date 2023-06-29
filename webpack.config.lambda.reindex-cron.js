const config = require('./webpack.config.lambda');

module.exports = {
  ...config,
  entry: {
    'reindex-status':
      './web-api/workflow-terraform/reindex-cron/main/lambdas/reindex-status.js',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: `${__dirname}/web-api/workflow-terraform/reindex-cron/main/lambdas/dist`,
  },
};
