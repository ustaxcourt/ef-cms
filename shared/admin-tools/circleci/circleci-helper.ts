import { find } from 'lodash';
import { sleep } from '@shared/tools/helpers';
import axios from 'axios';

const findPendingJob = async ({
  apiToken,
  jobName,
  workflowId,
}: {
  apiToken: string;
  jobName: string;
  workflowId: string;
}): Promise<any> => {
  const getAllJobsRequest = {
    headers: { 'Circle-Token': apiToken },
    method: 'GET',
    url: `https://circleci.com/api/v2/workflow/${workflowId}/job`,
  };

  let approvalRequestId = '';
  try {
    const allJobsInWorkflow = await axios.get(
      getAllJobsRequest.url,
      getAllJobsRequest,
    );
    const jobWithApprovalNeeded = find(allJobsInWorkflow.data.items, o => {
      return o.name === jobName;
    });
    // approvalRequestId = jobWithApprovalNeeded.approval_request_id;
    approvalRequestId = jobWithApprovalNeeded;
  } catch (err) {
    console.error(
      `Unable to determine approval id of pending job ${jobName}`,
      err,
    );
  }

  return approvalRequestId;
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
  let approvalRequest = await findPendingJob({
    apiToken,
    jobName,
    workflowId,
  });
  if (!approvalRequest.approval_request_id.length) {
    return;
  }

  const approveJobRequest = {
    headers: { 'Circle-Token': apiToken },
    method: 'POST',
    url: `https://circleci.com/api/v2/workflow/${workflowId}/approve/${approvalRequest.approval_request_id}`,
  };

  // Get the wait-for-reindex job (we have access to this inside findPendingJobs right now)
  // Check job.status on wait-for-reindex job
  // If job.status is "blocked", wait.
  // Keep waiting until job is no longer "blocked" (enters 'on hold', presumably)

  let counter = 0;
  while (approvalRequest.status === 'blocked' && counter < 10) {
    console.log('Skipping approval. Job status is blocked.');
    await sleep(2000);
    approvalRequest = await findPendingJob({
      apiToken,
      jobName,
      workflowId,
    });
    ++counter;
  }

  try {
    await axios.post(approveJobRequest.url, {}, approveJobRequest);
  } catch (err) {
    console.log(`Unable to approve pending job ${jobName}`, err);
  }
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

  try {
    await axios.post(cancelWorkflowRequest.url, {}, cancelWorkflowRequest);
  } catch (err) {
    console.log(`Unable to cancel workflow ${workflowId}`, err);
  }
};

export const getPipelineStatus = async ({
  apiToken,
  pipelineId,
}: {
  apiToken: string;
  pipelineId: string;
}): Promise<string | undefined> => {
  let pipelineStatus;

  const pipelineStatusRequest = {
    headers: { 'Circle-Token': apiToken },
    method: 'GET',
    url: `https://circleci.com/api/v2/pipeline/${pipelineId}/workflow`,
  };

  try {
    const pipelineStatusResponse = await axios.get(
      pipelineStatusRequest.url,
      pipelineStatusRequest,
    );
    if (
      'items' in pipelineStatusResponse.data &&
      pipelineStatusResponse.data.items &&
      'status' in pipelineStatusResponse.data.items[0]
    ) {
      pipelineStatus = pipelineStatusResponse.data.items[0].status;
    }
  } catch (err) {
    console.log(`Unable to determine status of pipeline ${pipelineId}`, err);
  }

  return pipelineStatus;
};
