const webpack = require('webpack');

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
  plugins: [
    new webpack.EnvironmentPlugin({
      API_URL: null,
      CI: null,
      CIRCLE_SHA1: null,
      COGNITO: null,
      COGNITO_CLIENT_ID: null,
      COGNITO_REDIRECT_URI: null,
      COGNITO_TOKEN_URL: null,
      ENV: null,
      FILE_UPLOAD_MODAL_TIMEOUT: null,
      NO_SCANNER: null,
      NODE_ENV: null,
      SCANNER_RESOURCE_URI: null,
      SESSION_MODAL_TIMEOUT: null,
      SESSION_TIMEOUT: null,
      SKIP_VIRUS_SCAN: null,
      STAGE: null,
      USTC_DEBUG: null,
      USTC_ENV: null,
      WS_URL: null,
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  target: 'node',
};
