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
  const getAllJobsRequest = {
    headers: { 'Circle-Token': apiToken },
    method: 'GET',
    url: `https://circleci.com/api/v2/workflow/${workflowId}/job`,
  };

  const allJobsInWorkflow = await axios.get(
    getAllJobsRequest.url,
    getAllJobsRequest,
  );

  const jobWithApprovalNeeded = find(allJobsInWorkflow.data.items, o => {
    return o.name === jobName;
  });

  return jobWithApprovalNeeded.approval_request_id;
};

export const approvePendingJob = async ({
  apiToken,
  jobName,
  workflowId,
}: {
  apiToken: string;
  jobName: string;
  workflowId: string;
}): Promise<void> => {
  const approvalRequestId = await findPendingJob({
    apiToken,
    jobName,
    workflowId,
  });
  const approveJobRequest = {
    headers: { 'Circle-Token': apiToken },
    method: 'POST',
    url: `https://circleci.com/api/v2/workflow/${workflowId}/approve/${approvalRequestId}`,
  };

  await axios.post(approveJobRequest.url, {}, approveJobRequest);
};

export const cancelWorkflow = async ({
  apiToken,
  workflowId,
}: {
  apiToken: string;
  workflowId: string;
}): Promise<void> => {
  const cancelWorkflowRequest = {
    headers: { 'Circle-Token': apiToken },
    method: 'POST',
    url: `https://circleci.com/api/v2/workflow/${workflowId}/cancel`,
  };

  await axios.post(cancelWorkflowRequest.url, {}, cancelWorkflowRequest);
};

export const getPipelineStatus = async ({
  apiToken,
  pipelineId,
}: {
  apiToken: string;
  pipelineId: string;
}): Promise<string | undefined> => {
  const pipelineStatusRequest = {
    headers: { 'Circle-Token': apiToken },
    method: 'GET',
    url: `https://circleci.com/api/v2/pipeline/${pipelineId}/workflow`,
  };

  const pipelineStatusResponse = await axios.get(
    pipelineStatusRequest.url,
    pipelineStatusRequest,
  );

  let pipelineStatus;
  if (
    'items' in pipelineStatusResponse.data &&
    pipelineStatusResponse.data.items &&
    'status' in pipelineStatusResponse.data.items[0]
  ) {
    pipelineStatus = pipelineStatusResponse.data.items[0].status;
  }

  return pipelineStatus;
};
