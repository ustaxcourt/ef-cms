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

  let approvalRequestId = '';
  try {
    const allJobsInWorkflow = await axios.get(
      getAllJobsRequest.url,
      getAllJobsRequest,
    );
    const jobWithApprovalNeeded = find(allJobsInWorkflow.data.items, o => {
      return o.name === jobName;
    });
    approvalRequestId = jobWithApprovalNeeded.approval_request_id;
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
  const approvalRequestId = await findPendingJob({
    apiToken,
    jobName,
    workflowId,
  });
  if (!approvalRequestId.length) {
    return;
  }

  const approveJobRequest = {
    headers: { 'Circle-Token': apiToken },
    method: 'POST',
    url: `https://circleci.com/api/v2/workflow/${workflowId}/approve/${approvalRequestId}`,
  };

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

export const getOrganizationId = async ({
  apiToken,
  projectSlug,
}: {
  apiToken: string;
  projectSlug: string;
}): Promise<string> => {
  const getProjectRequest = {
    headers: { 'Circle-Token': apiToken },
    method: 'GET',
    url: `https://circleci.com/api/v2/project/${projectSlug}`,
  };

  const projectResponse = await axios.get(getProjectRequest.url, {
    headers: getProjectRequest.headers,
  });

  return projectResponse.data.organization_id;
};

export const getContexts = async ({
  apiToken,
  ownerId,
}: {
  apiToken: string;
  ownerId: string;
}): Promise<{ id: string; name: string }[]> => {
  const getContextsRequest = {
    headers: { 'Circle-Token': apiToken },
    method: 'GET',
    url: `https://circleci.com/api/v2/context?owner-id=${ownerId}&owner-type=organization`,
  };

  const contextsResponse = await axios.get(getContextsRequest.url, {
    headers: getContextsRequest.headers,
  });

  return contextsResponse.data.items;
};

export const updateContextVariable = async ({
  apiToken,
  contextId,
  variableName,
  variableValue,
}: {
  apiToken: string;
  contextId: string;
  variableName: string;
  variableValue: string;
}): Promise<void> => {
  const updateVariableRequest = {
    headers: { 'Circle-Token': apiToken, 'Content-Type': 'application/json' },
    method: 'PUT',
    url: `https://circleci.com/api/v2/context/${contextId}/variable/${variableName}`,
  };

  await axios.put(
    updateVariableRequest.url,
    { value: variableValue },
    { headers: updateVariableRequest.headers },
  );
};
