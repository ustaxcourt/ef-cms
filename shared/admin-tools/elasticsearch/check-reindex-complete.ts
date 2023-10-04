const { getClient } = require('../../../web-api/elasticsearch/client');

const getClusterStats = async ({ environmentName, version }) => {
  const esClient = await getClient({ environmentName, version });
  const apiResponse = await esClient.indices.stats({
    index: '_all',
    level: 'indices',
  });

  const info = apiResponse.body.indices;

  const counts = {};
  for (const indexName of ['efcms-case', 'efcms-docket-entry', 'efcms-user']) {
    const res = await esClient.count({
      index: indexName,
    });
    counts[indexName] = res.body.count;
  }

  return { counts, info };
};

exports.isReindexComplete = async environmentName => {
  const destinationVersion = process.env.DESTINATION_TABLE.split('-').pop();
  const currentVersion = destinationVersion === 'alpha' ? 'beta' : 'alpha';

  let diffTotal = 0;
  const { counts: currentCounts } = await getClusterStats({
    environmentName,
    version: currentVersion,
  });
  let { counts: destinationCounts, info: destinationInfo } =
    await getClusterStats({
      environmentName,
      version: destinationVersion,
    });

  for (const indexName of ['efcms-case', 'efcms-docket-entry', 'efcms-user']) {
    const countCurrent = currentCounts[indexName];
    const countDestination = destinationCounts[indexName];

    const diff = Math.abs(countCurrent - countDestination);
    diffTotal += diff;
    console.log(`${indexName} has a diff of ${diff}`);
  }

  if (diffTotal > 0) {
    console.log('Indexes are not in sync, returning false');
    return false;
  }

  for (const indexName of [
    'efcms-case-deadline',
    'efcms-message',
    'efcms-work-item',
  ]) {
    const operationsDestination =
      destinationInfo[indexName].total.translog.operations;
    if (operationsDestination > 0) {
      console.log(
        `${operationsDestination} operations on ${indexName} still processing, waiting 60 seconds to check operations again.`,
      );
      return false;
    }
  }

  return true;
};
