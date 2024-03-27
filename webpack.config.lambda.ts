import CopyPlugin from 'copy-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import type { Configuration } from 'webpack';

const lambdaConfig: Configuration = {
  externals: {
    '@sparticuz/chromium': '@sparticuz/chromium',
    'aws-crt': 'aws-crt',
    'puppeteer-core': 'puppeteer-core',
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
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    plugins: [new TsconfigPathsPlugin()], // Allows us to use the tsconfig path alias + basePath
  },
  target: 'node',
};

// eslint-disable-next-line import/no-default-export
export default lambdaConfig;
