/**
 * check that a subset of ES indexes counts on alpha and beta match.
 */

// @path
const { getClient } = require('../../../web-api/elasticsearch/client');

const destinationVersion = process.env.DESTINATION_TABLE.split('-').pop();

const getClusterStats = async ({ environmentName, version }) => {
  const esClient = await getClient({ environmentName, version });
  const info = await esClient.indices.stats({
    index: '_all',
    level: 'indices',
  });
  return info;
};

const currentVersion = destinationVersion === 'alpha' ? 'beta' : 'alpha';

exports.isReindexComplete = async environmentName => {
  let diffTotal = 0;
  const currentInfo = await getClusterStats({
    environmentName,
    version: currentVersion,
  });
  let destinationInfo = await getClusterStats({
    environmentName,
    version: destinationVersion,
  });

  for (const indexName of [
    'efcms-case',
    'efcms-docket-entry',
    'efcms-user',
    'efcms-user-case',
  ]) {
    const countCurrent = currentInfo.indices[indexName].total.docs.count;
    const countDestination =
      destinationInfo.indices[indexName].total.docs.count;

    console.log('countCurrent', countCurrent);
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
