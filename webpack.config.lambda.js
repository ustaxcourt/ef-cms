module.exports = {
  mode: 'production',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(jsx)$/,
        use: ['babel-loader'],
      },
      {
        test: /\.(map|node)$/,
        use: ['file-loader'],
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  target: 'node',
};
