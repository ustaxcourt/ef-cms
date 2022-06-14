module.exports = {
  devtool: false,
  entry: './aws/lambdas/RotateInfoIndices/src/index.js',
  mode: 'production',
  output: {
    clean: true,
    filename: 'index.js',
    path: __dirname + '/aws/lambdas/RotateInfoIndices/dist',
  },
  target: 'node',
};
