const config = require('./webpack.config.lambda');

module.exports = {
  ...config,
  entry: {
    'glue-job-status':
      './web-api/workflow-terraform/glue-cron/main/lambdas/glue-job-status.ts',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: `${__dirname}/web-api/workflow-terraform/glue-cron/main/lambdas/dist`,
  },
};
