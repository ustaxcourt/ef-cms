const config = require('./webpack.config.client');

module.exports = {
  ...config,
  devServer: {
    compress: false,
    historyApiFallback: true,
    hot: false,
    https: false,
    port: 1234,
  },
  entry: {
    main: './web-client/src/index.dev.js',
  },
  mode: 'development',
};
