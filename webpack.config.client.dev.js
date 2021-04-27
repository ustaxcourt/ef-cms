const config = require('./webpack.config.client');
const HtmlWebpackPlugin = require('html-webpack-plugin');

config.plugins.push(
  new HtmlWebpackPlugin({
    minify: false,
    template: './web-client/src/index.pug',
  }),
);

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
  output: {
    clean: true,
    filename: `index.${Date.now()}.js`,
    path: __dirname + '/dist',
  },
};
