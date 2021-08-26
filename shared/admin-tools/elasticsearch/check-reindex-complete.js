// arguments: env

/**
 * check that a subset of ES indexes counts on alpha and beta match.
 */

// @path
const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';

const getCounts = async ({ indexName, version }) => {
  const esClient = await getClient({ environmentName, version });
  const info = await esClient.indices.stats({ index: indexName });
  return info['_all'].total.docs.count;
};

(async () => {
  let diffTotal = 0;
  for (const indexName of [
    'efcms-case',
    'efcms-docket-entry',
    'efcms-user',
    'efcms-user-case',
  ]) {
    const [countAlpha, countBeta] = await Promise.all(
      ['alpha', 'beta'].map(version => getCounts({ indexName, version })),
    );

    const diff = Math.abs(countAlpha - countBeta);
    diffTotal += diff;
    console.log(`${indexName} has a diff of ${diff}`);
  }

  if (diffTotal > 0) {
    console.log('Indexes are not in sync, exiting with 1');
    process.exit(1);
  }
})();
