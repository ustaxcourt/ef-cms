const getConfig = require('./webpack.config.lambda');

module.exports = {
  ...getConfig(['.']),
  entry: {
    'migration-status':
      './web-api/workflow-terraform/migration-cron/main/lambdas/migration-status.js',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: `${__dirname}/web-api/workflow-terraform/migration-cron/main/lambdas/dist`,
  },
};
