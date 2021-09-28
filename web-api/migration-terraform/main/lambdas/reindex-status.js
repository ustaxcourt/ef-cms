const axios = require('axios');
const { find } = require('lodash');

// Using the circle_workflow_id, get all jobs in the workflow, then with that grab the approval_request_id (which is the pending), then send command to approve job

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
  const personalApiToken = '1234';
  const workflowId = '1234';

  //get all jobs in the workflow
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

  //then make the req below
  const approve_job = {
    headers: { 'Circle-Token': personalApiToken },
    method: 'POST',
    url: `https://circleci.com/api/v2/workflow/${workflowId}/approve/${jobWithApprovalNeeded.approval_request_id}`,
  };
  const response = await axios.post(approve_job.url, {}, approve_job);
};

exports.handler();
