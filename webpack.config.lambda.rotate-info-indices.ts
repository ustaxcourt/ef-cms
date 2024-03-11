import config from './webpack.config.lambda';
import type { Configuration } from 'webpack';

const rotateInfoIndicesConfig: Configuration = {
  ...config,
  devtool: false,
  entry: './aws/lambdas/RotateInfoIndices/src/index.js',
  mode: 'production',
  optimization: {
    minimize: false,
  },
  output: {
    clean: true,
    filename: 'index.js',
    libraryTarget: 'umd',
    path: __dirname + '/aws/lambdas/RotateInfoIndices/dist',
  },
  target: 'node',
};

// eslint-disable-next-line import/no-default-export
export default rotateInfoIndicesConfig;
