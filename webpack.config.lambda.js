module.exports = {
  mode: 'production',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
      },
      {
        test: /\.(map|node)$/,
        use: ['file-loader'],
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  plugins: [],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  target: 'node',
};
