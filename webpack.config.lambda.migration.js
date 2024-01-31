const getConfig = require('./webpack.config.lambda');

module.exports = {
  ...getConfig(Object.keys(['.']).map(key => `./${key.split('/')[0]}`)),
  entry: {
    migration:
      './web-api/workflow-terraform/migration/main/lambdas/migration.js',
    'migration-segments':
      './web-api/workflow-terraform/migration/main/lambdas/migration-segments.js',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: `${__dirname}/web-api/workflow-terraform/migration/main/lambdas/dist`,
  },
};
