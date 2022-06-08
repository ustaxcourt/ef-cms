/* eslint-disable id-denylist */

const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: false,
  module: {
    rules: [
      {
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'web-client/src'),
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
      },
      {
        include: [
          path.resolve(__dirname, 'web-client/src'),
          path.resolve(__dirname, 'node_modules'),
        ],
        test: /\.(png|svg|jpg|jpeg|gif|pdf|woff|woff2|ttf)$/i,
        type: 'asset',
      },
      {
        include: [
          path.resolve(__dirname, 'web-client/src'),
          path.resolve(__dirname, 'node_modules'),
        ],
        test: /\.css$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        include: path.resolve(__dirname, 'web-client/src'),
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        include: path.resolve(__dirname, 'web-client/src'),
        test: /\.pug$/i,
        use: ['pug-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPugPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.EnvironmentPlugin({
      API_URL: null,
      CHECK_DEPLOY_DATE_INTERVAL: null,
      CI: null,
      CIRCLE_SHA1: null,
      COGNITO: null,
      COGNITO_CLIENT_ID: null,
      COGNITO_LOGIN_URL: null,
      COGNITO_REDIRECT_URI: null,
      COGNITO_SUFFIX: null,
      COGNITO_TOKEN_URL: null,
      ENV: null,
      FILE_UPLOAD_MODAL_TIMEOUT: null,
      IS_LOCAL: null,
      NO_SCANNER: null,
      PDF_EXPRESS_LICENSE_KEY: null,
      PUBLIC_SITE_URL: null,
      SCANNER_RESOURCE_URI: null,
      SESSION_MODAL_TIMEOUT: null,
      SESSION_TIMEOUT: null,
      SKIP_VIRUS_SCAN: null,
      STAGE: null,
      USTC_DEBUG: null,
      USTC_ENV: null,
      WS_URL: null,
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new CopyPlugin({
      patterns: [
        { from: 'node_modules/pdfjs-dist/legacy/build', to: '.' },
        { from: 'node_modules/react-quill/dist', to: '.' },
        { from: 'node_modules/pdf-lib/dist', to: '.' },
        { from: 'web-client/src/favicons', to: '.' },
        { from: 'web-client/src/site.webmanifest', to: '.' },
        { from: 'web-client/src/deployed-date.txt', to: '.' },

        {
          from: './node_modules/@pdftron/pdfjs-express-viewer/public',
          to: './pdfjsexpress',
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util/'),
    },
  },
  stats: {
    errorDetails: true,
  },
  target: 'web',
};
