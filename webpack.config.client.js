const CopyPlugin = require('copy-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const webpack = require('webpack');

module.exports = {
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|pdf|woff|woff2|ttf)$/i,
        use: ['file-loader'],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.pug$/i,
        use: ['pug-loader'],
      },
    ],
  },
  output: {
    filename: `index.${Date.now()}.js`,
    path: __dirname + '/dist',
  },
  plugins: [
    new FaviconsWebpackPlugin('./web-client/src/favicon-32x32.png'),
    new HtmlWebpackPugPlugin(),
    new HtmlWebpackPlugin({
      minify: false,
      template: './web-client/src/index.pug',
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new CopyPlugin({
      patterns: [
        { from: 'node_modules/pdfjs-dist/es5/build', to: '.' },
        { from: 'node_modules/react-quill/dist', to: '.' },
        { from: 'node_modules/pdf-lib/dist', to: '.' },
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    },
  },
  target: 'web',
};
