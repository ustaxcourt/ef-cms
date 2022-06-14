module.exports = {
  devtool: false,
  entry: './aws/lambdas/RotateInfoIndices/src/index.js',
  externals: ['aws-crt', 'aws-sdk'],
  mode: 'production',
  optimization: {
    minimize: false,
  },
  output: {
    clean: true,
    filename: 'index.js',
    path: __dirname + '/aws/lambdas/RotateInfoIndices/dist',
  },
  target: 'node',
};
