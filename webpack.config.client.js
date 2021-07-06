const CopyPlugin = require('copy-webpack-plugin');
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
  plugins: [
    new HtmlWebpackPugPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.EnvironmentPlugin({
      API_URL: null,
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
      NO_SCANNER: null,
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
