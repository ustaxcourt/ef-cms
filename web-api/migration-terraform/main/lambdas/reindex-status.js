const axios = require('axios');
const { find } = require('lodash');
/**
 * check that a subset of ES indexes counts on alpha and beta match.
 */

// @path
const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';

const destinationVersion = process.env.DESTINATION_TABLE.split('-').pop();

const getClusterStats = async ({ version }) => {
  const esClient = await getClient({ environmentName, version });
  const info = await esClient.indices.stats({
    index: '_all',
    level: 'indices',
  });
  return info;
};

const currentVersion = destinationVersion === 'alpha' ? 'beta' : 'alpha';

const isReindexComplete = async () => {
  let diffTotal = 0;
  const currentInfo = await getClusterStats({ version: currentVersion });
  let destinationInfo = await getClusterStats({ version: destinationVersion });

  for (const indexName of [
    'efcms-case',
    'efcms-docket-entry',
    'efcms-user',
    'efcms-user-case',
  ]) {
    const countCurrent = currentInfo.indices[indexName].total.docs.count;
    const countDestination =
      destinationInfo.indices[indexName].total.docs.count;
    const diff = Math.abs(countCurrent - countDestination);
    diffTotal += diff;
    console.log(`${indexName} has a diff of ${diff}`);
  }

  if (diffTotal > 0) {
    console.log('Indexes are not in sync, exiting with 1');
    return false;
  }

  for (const indexName of [
    'efcms-case-deadline',
    'efcms-message',
    'efcms-work-item',
  ]) {
    const operationsDestination =
      destinationInfo.indices[indexName].total.translog.operations;
    if (operationsDestination > 0) {
      console.log(
        `${operationsDestination} operations on ${indexName} still processing, waiting 60 seconds to check operations again.`,
      );
      return false;
    }
  }

  return true;
};

exports.handler = async () => {
  const isReindexFinished = await isReindexComplete();

  if (isReindexFinished) {
    const personalApiToken = process.env.CIRCLE_MACHINE_USER_TOKEN;
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
  }
};
