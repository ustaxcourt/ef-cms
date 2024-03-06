import config from './webpack.config.lambda';
import type { Configuration } from 'webpack';

const waitForWorkflowConfig: Configuration = {
  ...config,
  entry: {
    'wait-for-workflow':
      './web-api/workflow-terraform/wait-for-workflow-cron/main/lambdas/wait-for-workflow.ts',
  },
  output: {
    clean: true,
    libraryTarget: 'umd',
    path: `${__dirname}/web-api/workflow-terraform/wait-for-workflow-cron/main/lambdas/dist`,
  },
};

// eslint-disable-next-line import/no-default-export
export default waitForWorkflowConfig;
