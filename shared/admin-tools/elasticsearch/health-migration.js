// arguments: env

/**
 * for each index, check the index count for alpha and beta
 *
 * we might do this for after a migration
 */

// @path
const elasticsearchMappings = require('../../../web-api/elasticsearch/elasticsearch-mappings');
const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';

console.log(environmentName);

// const getCurrentColor = environmentName => {
//   DocumentClient.query({
//     TableName: `efcms-deploy-${environmentName}`,

const getCounts = async ({ indexName, version }) => {
  const esClient = await getClient({ environmentName, version });
  const info = await esClient.indices.stats({ index: indexName });

  return info['_all'].total.docs.count;
};

(async () => {
  // const currentColor = 'green'; // gets a row from DynamoDB

  // const domains = await listDomains();
  // console.log(domains);

  const totals = {
    alpha: 0,
    beta: 0,
  };

  console.log(`## ${environmentName} Index Summary`);
  console.log('+----+----+----+----+');
  console.log('| Index | Alpha | Beta | Difference |');
  console.log('+----+----+----+----+');

  for (const indexName of Object.keys(elasticsearchMappings)) {
    const [countAlpha, countBeta] = await Promise.all(
      ['alpha', 'beta'].map(version => getCounts({ indexName, version })),
    );

    // const alpha - beta
    console.log(
      `| ${indexName} |  ${countAlpha} | ${countBeta} | ${Math.abs(
        countAlpha - countBeta,
      )} |`,
    );
    totals.alpha += countAlpha;
    totals.beta += countBeta;
    console.log('+----+----+----+----+');
  }

  const [nominator, denominator] = [totals.alpha, totals.beta].sort(
    (a, b) => a - b,
  );

  console.log(
    `Total Difference: ${Math.round(
      totals.alpha - totals.beta,
    )} (${nominator}/${denominator}) ${
      parseInt((nominator / denominator) * 10000) / 100
    }% `,
  );
})();

// console.log(indexes);
// simply check their differences, each of them between clusters
