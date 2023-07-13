const config = require('./webpack.config.lambda');

module.exports = {
  ...config,
  entry: {
    'process-s3-queue':
      './web-api/workflow-terraform/process-s3-queue/main/lambdas/process-s3-queue.js',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: `${__dirname}/web-api/workflow-terraform/process-s3-queue/main/lambdas/dist`,
  },
};
