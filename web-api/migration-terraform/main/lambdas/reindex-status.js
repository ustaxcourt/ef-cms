const axios = require('axios');
const {
  isReindexComplete,
} = require('../../../../shared/admin-tools/elasticsearch/check-reindex-complete');
const { find } = require('lodash');

exports.handler = async () => {
  // TODO: Do something when this script execution exits with code 0 (approve circle CI workflow)
  // const { exec } = require('child_process');
  // exec('sh ./wait-for-reindex-to-finish.sh', (error, stdout, stderr) => {
  //   console.log(stdout);
  //   console.log(stderr);

  //   if (error !== null) {
  //     console.log(`exec error: ${error}`);
  //   }
  // });
  //TODO dont hardcode api token

  await isReindexComplete();

  const personalApiToken = '1234';
  const workflowId = process.env.CIRCLE_WORKFLOW_ID;

  const get_all_jobs = {
    headers: { 'Circle-Token': personalApiToken },
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

  const approve_job = {
    headers: { 'Circle-Token': personalApiToken },
    method: 'POST',
    url: `https://circleci.com/api/v2/workflow/${workflowId}/approve/${jobWithApprovalNeeded.approval_request_id}`,
  };
  return await axios.post(approve_job.url, {}, approve_job);
};

exports.handler();
