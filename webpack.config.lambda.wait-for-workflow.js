const getConfig = require('./webpack.config.lambda');

module.exports = {
  ...getConfig(Object.keys(['.']).map(key => `./${key.split('/')[0]}`)),
  entry: {
    'wait-for-workflow':
      './web-api/workflow-terraform/wait-for-workflow-cron/main/lambdas/wait-for-workflow.js',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: `${__dirname}/web-api/workflow-terraform/wait-for-workflow-cron/main/lambdas/dist`,
  },
};
