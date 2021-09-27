const https = require('https');

exports.handler = () => {
  //TODO: Do something when this script execution exits with code 0 (approve circle CI workflow)
  // const { exec } = require('child_process');
  // exec('sh ./wait-for-reindex-to-finish.sh', (error, stdout, stderr) => {
  //   console.log(stdout);
  //   console.log(stderr);
  //   if (error !== null) {
  //     console.log(`exec error: ${error}`);
  //   }
  // });
  // const url = {
  //   headers: { authorization: 'Basic REPLACE_BASIC_AUTH' },
  //   method: 'POST',
  //   url: `https://circleci.com/api/v2/workflow/${CIRCLE_WORKFLOW_ID}/approve/%7Bapproval_request_id%7D`,
  // };
  // https.get(url, function (error, response, body) {
  //   if (error) throw new Error(error);
  //   console.log(body);
  // });
};
