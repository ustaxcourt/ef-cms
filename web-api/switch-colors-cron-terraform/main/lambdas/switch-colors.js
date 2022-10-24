const axios = require('axios');
const { findLast } = require('lodash');

exports.handler = async () => {
  console.log('Approving CircleCI wait for color switch job');

  const apiToken = process.env.CIRCLE_MACHINE_USER_TOKEN;
  const workflowId = process.env.CIRCLE_WORKFLOW_ID;

  const get_all_jobs = {
    headers: { 'Circle-Token': apiToken },
    method: 'GET',
    url: `https://circleci.com/api/v2/workflow/${workflowId}/job`,
  };

  const allJobsInWorkflow = await axios.get(get_all_jobs.url, get_all_jobs);

  const jobWithApprovalNeeded = findLast(
    allJobsInWorkflow.data.items,
    function (o) {
      return o.approval_request_id !== undefined;
    },
  );

  const approveJob = {
    headers: { 'Circle-Token': apiToken },
    method: 'POST',
    url: `https://circleci.com/api/v2/workflow/${workflowId}/approve/${jobWithApprovalNeeded.approval_request_id}`,
  };

  await axios.post(approveJob.url, {}, approveJob);
};
