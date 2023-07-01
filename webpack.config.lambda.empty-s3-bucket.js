const config = require('./webpack.config.lambda');

module.exports = {
  ...config,
  entry: {
    'empty-s3-bucket':
      './web-api/workflow-terraform/empty-s3-bucket-cron/main/lambdas/empty-s3-bucket.js',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: `${__dirname}/web-api/workflow-terraform/empty-s3-bucket-cron/main/lambdas/dist`,
  },
};
