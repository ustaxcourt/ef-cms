const config = require('./webpack.config.lambda');

module.exports = {
  ...config,
  entry: {
    migration: './web-api/migration-terraform/main/lambdas/migration.js',
    'migration-segments':
      './web-api/migration-terraform/main/lambdas/migration-segments.js',
  },
  externals: ['aws-sdk'],
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: __dirname + '/web-api/migration-terraform/main/lambdas/dist',
  },
};
