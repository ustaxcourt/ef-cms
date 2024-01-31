const CopyPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { sentryWebpackPlugin } = require('@sentry/webpack-plugin');

module.exports = {
  devtool: 'source-map',
  externals: {
    '@sparticuz/chromium': 'commonjs @sparticuz/chromium',
    'aws-crt': 'commonjs aws-crt',
    'puppeteer-core': 'commonjs puppeteer-core',
  },
  mode: 'production',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        // eslint-disable-next-line
        test: /\.(jsx)$/,
        use: ['babel-loader'],
      },
      {
        // eslint-disable-next-line
        test: /\.(map|node)$/,
        use: ['file-loader'],
      },
      {
        exclude: /node_modules/,
        // eslint-disable-next-line
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'node_modules/pdfjs-dist/legacy/build', to: '.' },
        { from: 'node_modules/pdf-lib/dist', to: '.' },
        { from: 'shared/static/pdfs/amended-petition-form.pdf', to: '.' },
      ],
    }),
    sentryWebpackPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'cody-seibert',
      project: 'node-awslambda',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    plugins: [new TsconfigPathsPlugin()], // Allows us to use the tsconfig path alias + basePath
  },
  target: 'node',
};
