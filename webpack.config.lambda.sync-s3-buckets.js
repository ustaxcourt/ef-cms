const config = require('./webpack.config.lambda');

module.exports = {
  ...config,
  entry: {
    'sync-s3-buckets':
      './web-api/workflow-terraform/sync-s3-buckets-cron/main/lambdas/sync-s3-buckets.js',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: `${__dirname}/web-api/workflow-terraform/sync-s3-buckets-cron/main/lambdas/dist`,
  },
};
