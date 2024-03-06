import config from './webpack.config.lambda';

const switchColorsCronConfig = {
  ...config,
  entry: {
    'switch-colors-status':
      './web-api/workflow-terraform/switch-colors-cron/main/lambdas/switch-colors.ts',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: `${__dirname}/web-api/workflow-terraform/switch-colors-cron/main/lambdas/dist`,
  },
};

// eslint-disable-next-line import/no-default-export
export default switchColorsCronConfig;
