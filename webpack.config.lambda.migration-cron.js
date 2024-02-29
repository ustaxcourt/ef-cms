const config = require('./webpack.config.lambda');

module.exports = {
  ...config,
  entry: {
    'migration-status':
      './web-api/workflow-terraform/migration-cron/main/lambdas/migration-status.ts',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: `${__dirname}/web-api/workflow-terraform/migration-cron/main/lambdas/dist`,
  },
};
