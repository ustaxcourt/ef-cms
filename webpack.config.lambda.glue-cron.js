const getConfig = require('./webpack.config.lambda');

module.exports = {
  ...getConfig(['.']),
  entry: {
    'glue-job-status':
      './web-api/workflow-terraform/glue-cron/main/lambdas/glue-job-status.js',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: `${__dirname}/web-api/workflow-terraform/glue-cron/main/lambdas/dist`,
  },
};
