const axios = require('axios');
const { find } = require('lodash');

const findPendingJob = async ({ apiToken, workflowId }) => {
  const getAllJobs = {
    headers: { 'Circle-Token': apiToken },
    method: 'GET',
    url: `https://circleci.com/api/v2/workflow/${workflowId}/job`,
  };

  const allJobsInWorkflow = await axios.get(getAllJobs.url, getAllJobs);

  const jobWithApprovalNeeded = find(allJobsInWorkflow.data.items, o => {
    return o.approval_request_id !== undefined;
  });

  return jobWithApprovalNeeded.approval_request_id;
};

exports.approvePendingJob = async ({ apiToken, workflowId }) => {
  const pendingJobApprovalRequestId = findPendingJob({ apiToken, workflowId });
  const approveJob = {
    headers: { 'Circle-Token': apiToken },
    method: 'POST',
    url: `https://circleci.com/api/v2/workflow/${workflowId}/approve/${pendingJobApprovalRequestId}`,
  };

  await axios.post(approveJob.url, {}, approveJob);
};

exports.failPendingJob = async ({ apiToken, workflowId }) => {
  const pendingJobApprovalRequestId = findPendingJob({ apiToken, workflowId });
  const rejectJob = {
    headers: { 'Circle-Token': apiToken },
    method: 'POST',
    url: `https://circleci.com/api/v2/workflow/${workflowId}/reject/${pendingJobApprovalRequestId}`,
  };

  await axios.post(rejectJob.url, {}, rejectJob);
};
