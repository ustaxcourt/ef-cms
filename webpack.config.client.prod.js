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
  entry: {
    main: './web-client/src/index.prod.js',
  },
  mode: 'production',
  output: {
    clean: true,
    filename: `index.${Date.now()}.js`,
    path: __dirname + '/dist',
  },
};
