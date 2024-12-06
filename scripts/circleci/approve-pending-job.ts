#!/usr/bin/env npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgumentsAndEnvironmentVariables,
} from '../helpers/parseArgumentsAndEnvironmentVariables';
import { approvePendingJob } from '../../shared/admin-tools/circleci/circleci-helper';

const scriptConfig: ScriptConfig = {
  description: 'approve-pending-job - Approve a pending CircleCI job',
  environment: {
    apiToken: 'CIRCLE_MACHINE_USER_TOKEN',
    jobName: 'APPROVAL_JOB_NAME',
    workflowId: 'CIRCLE_WORKFLOW_ID',
  },
};
const { apiToken, jobName, workflowId } = parseArgumentsAndEnvironmentVariables(
  scriptConfig,
) as { apiToken: string; jobName: string; workflowId: string };

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  await approvePendingJob({ apiToken, jobName, workflowId });
})();
