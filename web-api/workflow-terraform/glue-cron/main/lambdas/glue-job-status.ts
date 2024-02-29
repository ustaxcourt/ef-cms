import {
  approvePendingJob,
  cancelWorkflow,
} from '../../../../../shared/admin-tools/circleci/circleci-helper';
import { getRunStateOfMostRecentJobRun } from '../../../../../shared/admin-tools/aws/glueHelper';
import type { Handler } from 'aws-lambda';

const FAILURE_STATES = ['ERROR', 'FAILED', 'STOPPED', 'TIMEOUT'];
const RUNNING_STATES = ['RUNNING', 'STARTING', 'STOPPING', 'WAITING'];

export const handler: Handler = async (_event, context) => {
  const mostRecentRunState = await getRunStateOfMostRecentJobRun();
  const results = { mostRecentRunState };

  if (!mostRecentRunState) {
    return succeed({ context, results });
  }

  if (RUNNING_STATES.includes(mostRecentRunState)) {
    console.log('Glue job is not yet complete', mostRecentRunState);
    return succeed({ context, results });
  }

  const apiToken = process.env.CIRCLE_MACHINE_USER_TOKEN!;
  const workflowId = process.env.CIRCLE_WORKFLOW_ID!;

  if (FAILURE_STATES.includes(mostRecentRunState)) {
    console.log(
      'Glue job failed, canceling CircleCI workflow',
      mostRecentRunState,
    );
    await cancelWorkflow({ apiToken, workflowId });
    return succeed({ context, results });
  }

  if (mostRecentRunState === 'SUCCEEDED') {
    const jobName = 'wait-for-glue-job';
    console.log(
      'Glue job succeeded, approving CircleCI "wait-for-glue-job" job',
      mostRecentRunState,
    );
    await approvePendingJob({ apiToken, jobName, workflowId });
    return succeed({ context, results });
  }

  console.log('Unhandled glue job run state', mostRecentRunState);
  return succeed({ context, results });
};

const succeed = ({ context, results }) => {
  console.log(results);
  return context.succeed(results);
};
