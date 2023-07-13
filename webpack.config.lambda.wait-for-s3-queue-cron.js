const config = require('./webpack.config.lambda');

module.exports = {
  ...config,
  entry: {
    's3-queue-status':
      './web-api/workflow-terraform/wait-for-s3-queue-cron/main/lambdas/s3-queue-status.js',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: `${__dirname}/web-api/workflow-terraform/wait-for-s3-queue-cron/main/lambdas/dist`,
  },
};
