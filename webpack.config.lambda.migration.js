const config = require('./webpack.config.lambda');

module.exports = {
  ...config,
  entry: {
    migration:
      './web-api/workflow-terraform/migration/main/lambdas/migration.js',
    'migration-segments':
      './web-api/workflow-terraform/migration/main/lambdas/migration-segments.js',
  },
  externals: ['aws-crt'],
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: `${__dirname}/web-api/workflow-terraform/migration/main/lambdas/dist`,
  },
};
