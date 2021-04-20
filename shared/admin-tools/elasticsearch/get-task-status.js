
const AWS = require('aws-sdk');
const {
  elasticsearchIndexes,
} = require('../../../web-api/elasticsearch/elasticsearch-indexes');
const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const waitUntilComplete = async taskId => {
  let status = false;
  while (!status) {
    status = await getTaskStatus(taskId)
    if (!status) await sleep(30000)
  }
  return true;
}

const getTaskStatus = async taskId => {
  const esClient = await getClient({ environmentName, version });
  const res = await esClient.tasks.get({taskId});
  console.log(`status is: ${res.completed}`)
  return !!res.completed;
}

(async () => {
  await waitUntilComplete('RkHp1tsdRRafFE9R489tCw:2958974');

})();
