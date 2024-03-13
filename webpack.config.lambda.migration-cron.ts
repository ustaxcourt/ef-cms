import config from './webpack.config.lambda';
import type { Configuration } from 'webpack';

const migrationCronConfig: Configuration = {
  ...config,
  entry: {
    'migration-status':
      './web-api/workflow-terraform/migration-cron/main/lambdas/migration-status.ts',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: `${__dirname}/web-api/workflow-terraform/migration-cron/main/lambdas/dist`,
  },
};

// eslint-disable-next-line import/no-default-export
export default migrationCronConfig;
