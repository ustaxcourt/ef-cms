import { find } from 'lodash';
import axios from 'axios';

const findPendingJob = async ({
  apiToken,
  jobName,
  workflowId,
}: {
  apiToken: string;
  jobName: string;
  workflowId: string;
}): Promise<string> => {
  const getAllJobs = {
    headers: { 'Circle-Token': apiToken },
    method: 'GET',
    url: `https://circleci.com/api/v2/workflow/${workflowId}/job`,
  };

  const allJobsInWorkflow = await axios.get(getAllJobs.url, getAllJobs);

  const jobWithApprovalNeeded = find(allJobsInWorkflow.data.items, o => {
    return o.name === jobName;
  });

  return jobWithApprovalNeeded.approval_request_id;
};

exports.approvePendingJob = async ({
  apiToken,
  jobName,
  workflowId,
}: {
  apiToken: string;
  jobName: string;
  workflowId: string;
}) => {
  const approvalRequestId = await findPendingJob({
    apiToken,
    jobName,
    workflowId,
  });
  const approveJob = {
    headers: { 'Circle-Token': apiToken },
    method: 'POST',
    url: `https://circleci.com/api/v2/workflow/${workflowId}/approve/${approvalRequestId}`,
  };

  await axios.post(approveJob.url, {}, approveJob);
};

exports.cancelWorkflow = async ({
  apiToken,
  workflowId,
}: {
  apiToken: string;
  workflowId: string;
}) => {
  const cancelWorkflow = {
    headers: { 'Circle-Token': apiToken },
    method: 'POST',
    url: `https://circleci.com/api/v2/workflow/${workflowId}/cancel`,
  };

  await axios.post(cancelWorkflow.url, {}, cancelWorkflow);
};
