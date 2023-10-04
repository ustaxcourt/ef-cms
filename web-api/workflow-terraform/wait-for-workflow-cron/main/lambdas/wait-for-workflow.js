const {
  approvePendingJob,
  cancelWorkflow,
  getPipelineStatus,
} = require('../../../../../shared/admin-tools/circleci/circleci-helper');

const apiToken = process.env.CIRCLE_MACHINE_USER_TOKEN;
const workflowId = process.env.CIRCLE_WORKFLOW_ID;
const jobName = process.env.APPROVAL_JOB_NAME;
const pipelineId = process.env.CIRCLE_PIPELINE_ID;

exports.handler = async (input, context) => {
  const pipelineStatus = await getPipelineStatus({ apiToken, pipelineId });
  const results = { pipelineStatus };

  if (
    !pipelineStatus ||
    pipelineStatus === 'running' ||
    pipelineStatus === 'on_hold'
  ) {
    return succeed({ context, results });
  }

  if (pipelineStatus === 'success') {
    await approvePendingJob({ apiToken, jobName, workflowId });
  } else {
    await cancelWorkflow({ apiToken, workflowId });
  }

  return succeed({ context, results });
};

const succeed = ({ context, results }) => {
  console.log(results);
  return context.succeed(results);
};
