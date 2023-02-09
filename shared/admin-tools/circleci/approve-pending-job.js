const axios = require('axios');
const { find } = require('lodash');

exports.approvePendingJob = async ({ apiToken, workflowId }) => {
  const getAllJobs = {
    headers: { 'Circle-Token': apiToken },
    method: 'GET',
    url: `https://circleci.com/api/v2/workflow/${workflowId}/job`,
  };

  const allJobsInWorkflow = await axios.get(getAllJobs.url, getAllJobs);

  const jobWithApprovalNeeded = find(allJobsInWorkflow.data.items, o => {
    return o.approval_request_id !== undefined;
  });

  const approveJob = {
    headers: { 'Circle-Token': apiToken },
    method: 'POST',
    url: `https://circleci.com/api/v2/workflow/${workflowId}/approve/${jobWithApprovalNeeded.approval_request_id}`,
  };

  await axios.post(approveJob.url, {}, approveJob);
};
