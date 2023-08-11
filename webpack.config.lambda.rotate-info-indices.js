const config = require('./webpack.config.lambda');

module.exports = {
  ...config,
  devtool: false,
  entry: './aws/lambdas/RotateInfoIndices/src/index.js',
  mode: 'production',
  optimization: {
    minimize: false,
  },
  output: {
    clean: true,
    filename: 'index.js',
    libraryTarget: 'umd',
    path: __dirname + '/aws/lambdas/RotateInfoIndices/dist',
  },
  target: 'node',
};
