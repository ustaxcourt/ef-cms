import config from './webpack.config.lambda';
import type { Configuration } from 'webpack';

const glueCronConfig: Configuration = {
  ...config,
  entry: {
    'glue-job-status':
      './web-api/workflow-terraform/glue-cron/main/lambdas/glue-job-status.ts',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: `${__dirname}/web-api/workflow-terraform/glue-cron/main/lambdas/dist`,
  },
};

// eslint-disable-next-line import/no-default-export
export default glueCronConfig;
