const config = require('./webpack.config.lambda');

module.exports = {
  ...config,
  entry: {
    's3-bucket-sync-status':
      './web-api/workflow-terraform/wait-for-s3-bucket-sync-cron/main/lambdas/s3-bucket-sync-status.js',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: `${__dirname}/web-api/workflow-terraform/wait-for-s3-bucket-sync-cron/main/lambdas/dist`,
  },
};
