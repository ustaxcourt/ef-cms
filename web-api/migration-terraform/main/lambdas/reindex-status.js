const https = require('https');
const { find } = require('lodash');

// Using the circle_workflow_id, get all jobs in the workflow, then with that grab the approval_request_id (which is the pending), then send command to approve job

exports.handler = () => {
  // TODO: Do something when this script execution exits with code 0 (approve circle CI workflow)
  const { exec } = require('child_process');
  exec('sh ./wait-for-reindex-to-finish.sh', (error, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    if (error !== null) {
      console.log(`exec error: ${error}`);
    }
  });
  //TODO dont hardcode api token
  //get all jobs in the workflow
  const get_all_jobs = {
    headers: { authorization: '' },
    method: 'GET',
    url: 'https://circleci.com/api/v2/workflow/fa0a0cee-1812-49a1-9676-da7d306773f7/job',
  };

  https.request(get_all_jobs, function (error, response, body) {
    console.log(response);
    const approval_request_info = find(response.items, function (o) {
      return o.approval_request_id !== undefined;
    });

    console.log(approval_request_info);

    if (error) throw new Error(error);
    console.log(body);
  });

  //get approval_rew_id

  //then make the req below
  // const url = {
  //   headers: { authorization: 'Basic REPLACE_BASIC_AUTH' },
  //   method: 'POST',
  //   url: `https://circleci.com/api/v2/workflow/${process.env.CIRCLE_WORKFLOW_ID}/approve/%7Bapproval_request_id%7D`,
  // };
  // https.get(url, function (error, response, body) {
  //   if (error) throw new Error(error);
  //   console.log(body);
  // });
};
// curl --request GET \
//   --url https://circleci.com/api/v2/workflow/fa0a0cee-1812-49a1-9676-da7d306773f7/job \
//   --header 'authorization:
exports.handler();
