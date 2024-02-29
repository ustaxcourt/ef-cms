const config = require('./webpack.config.lambda');

module.exports = {
  ...config,
  entry: {
    'wait-for-workflow':
      './web-api/workflow-terraform/wait-for-workflow-cron/main/lambdas/wait-for-workflow.ts',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: `${__dirname}/web-api/workflow-terraform/wait-for-workflow-cron/main/lambdas/dist`,
  },
};
