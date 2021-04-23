const config = require('./webpack.config.client');
const HtmlWebpackPlugin = require('html-webpack-plugin');

config.plugins.push(
  new HtmlWebpackPlugin({
    minify: false,
    template: './web-client/src/index-public.pug',
  }),
);

module.exports = {
  ...config,
  devServer: {
    compress: false,
    historyApiFallback: true,
    hot: false,
    https: false,
    port: 5678,
  },
  entry: {
    main: './web-client/src/index-public.dev.js',
  },
  mode: 'development',
  output: {
    clean: true,
    filename: `index.${Date.now()}.js`,
    path: __dirname + '/dist-public',
  },
};
