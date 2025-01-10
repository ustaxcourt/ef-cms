#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { cancelWorkflow } from '../../shared/admin-tools/circleci/circleci-helper';

const scriptConfig: ScriptConfig = {
  description: 'cancel-workflow - Cancel a CircleCI workflow',
  environment: {
    apiToken: 'CIRCLE_MACHINE_USER_TOKEN',
    workflowId: 'CIRCLE_WORKFLOW_ID',
  },
};
const { apiToken, workflowId } = parseArgsAndEnvVars(scriptConfig) as {
  apiToken: string;
  jobName: string;
  workflowId: string;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await cancelWorkflow({ apiToken, workflowId });
})();
