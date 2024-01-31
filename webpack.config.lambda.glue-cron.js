const getConfig = require('./webpack.config.lambda');

module.exports = {
  ...getConfig(Object.keys(['.']).map(key => `./${key.split('/')[0]}`)),
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
