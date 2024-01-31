const getConfig = require('./webpack.config.lambda');

module.exports = {
  ...getConfig(['.']),
  entry: {
    'switch-colors-status':
      './web-api/workflow-terraform/switch-colors-cron/main/lambdas/switch-colors.js',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: `${__dirname}/web-api/workflow-terraform/switch-colors-cron/main/lambdas/dist`,
  },
};
