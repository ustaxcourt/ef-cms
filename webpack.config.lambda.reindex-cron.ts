import config from './webpack.config.lambda';
import type { Configuration } from 'webpack';

const reindexCronConfig: Configuration = {
  ...config,
  entry: {
    'reindex-status':
      './web-api/workflow-terraform/reindex-cron/main/lambdas/reindex-status.ts',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: `${__dirname}/web-api/workflow-terraform/reindex-cron/main/lambdas/dist`,
  },
};

// eslint-disable-next-line import/no-default-export
export default reindexCronConfig;
