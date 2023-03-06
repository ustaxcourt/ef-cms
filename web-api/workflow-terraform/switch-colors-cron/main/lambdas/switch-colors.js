const {
  approvePendingJob,
} = require('../../../../../shared/admin-tools/circleci/circleci-helper');

exports.handler = async () => {
  console.log('Approving CircleCI wait for color switch job');

  const apiToken = process.env.CIRCLE_MACHINE_USER_TOKEN;
  const jobName = 'wait-for-switch';
  const workflowId = process.env.CIRCLE_WORKFLOW_ID;

  await approvePendingJob({ apiToken, jobName, workflowId });
};
