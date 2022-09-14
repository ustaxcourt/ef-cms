const axios = require('axios');
const {
  isReindexComplete,
} = require('../../../../shared/admin-tools/elasticsearch/check-reindex-complete');
const { find } = require('lodash');

exports.handler = async () => {
  const migrateFlag = process.env.MIGRATE_FLAG;
  const reindexFlag = process.env.REINDEX_FLAG;

  if (migrateFlag === 'true' || reindexFlag === 'true') {
    console.log(
      `Migrate flag is ${migrateFlag} and reindex flag is ${reindexFlag}`,
    );
    const environmentName = process.env.ENVIRONMENT;
    const isReindexFinished = await isReindexComplete(environmentName);

    if (!isReindexFinished) {
      console.log('Reindex is not complete');
      return;
    }
  }

  console.log('Approving CircleCI wait for reindex job');

  const apiToken = process.env.CIRCLE_MACHINE_USER_TOKEN;
  const workflowId = process.env.CIRCLE_WORKFLOW_ID;

  const get_all_jobs = {
    headers: { 'Circle-Token': apiToken },
    method: 'GET',
    url: `https://circleci.com/api/v2/workflow/${workflowId}/job`,
  };

  const allJobsInWorkflow = await axios.get(get_all_jobs.url, get_all_jobs);

  const jobWithApprovalNeeded = find(
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
