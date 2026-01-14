import {
  approvePendingJob,
  cancelWorkflow,
  getPipelineStatus,
} from '../../../../shared/admin-tools/circleci/circleci-helper';
import type { Handler } from 'aws-lambda';

const apiToken = process.env.CIRCLE_MACHINE_USER_TOKEN!;
const workflowId = process.env.CIRCLE_WORKFLOW_ID!;
const jobName = process.env.APPROVAL_JOB_NAME!;
const pipelineId = process.env.CIRCLE_PIPELINE_ID!;

export const handler: Handler = async (_event, _context) => {
  const pipelineStatus = await getPipelineStatus({ apiToken, pipelineId });
  const results = { pipelineStatus };

  if (
    !pipelineStatus ||
    pipelineStatus === 'running' ||
    pipelineStatus === 'on_hold'
  ) {
    return succeed(results);
  }

  if (pipelineStatus === 'success') {
    await approvePendingJob({ apiToken, jobName, workflowId });
  } else {
    await cancelWorkflow({ apiToken, workflowId });
  }

  return succeed(results);
};

const succeed = (results: { [k: string]: string | undefined }) => {
  console.log(results);
  return results;
};
