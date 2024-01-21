// arguments: env

/**
 * for each index, check the index count for alpha and beta
 *
 * we might do this for after a migration
 */

const {
  getBaseAliasFromIndexName,
} = require('../../../web-api/elasticsearch/elasticsearch-aliases');
const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';

console.log(environmentName);

const getCounts = async ({ indexName, version }) => {
  const esClient = await getClient({ environmentName, version });
  const info = await esClient.count({
    index: indexName,
  });

  return info.body.count;
};

const listIndices = async ({ version }) => {
  const esClient = await getClient({ environmentName, version });
  return (
    (await esClient.cat.indices({ format: 'json' })).body
      ?.filter(i => {
        return i.index.includes('efcms');
      })
      .map(i => i.index) || []
  );
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const totals = {
    alpha: 0,
    beta: 0,
  };

  console.log(`## ${environmentName} Index Summary`);
  const out = [];

  const counts = { alpha: {}, beta: {} };
  for (const version of Object.keys(counts)) {
    const indices = await listIndices({ version });
    for (const indexName of indices) {
      counts[version][getBaseAliasFromIndexName(indexName)] = await getCounts({
        indexName,
        version,
      });
    }
  }

  for (const aliasName of Object.keys(counts.alpha)) {
    const countAlpha = counts.alpha[aliasName];
    const countBeta = counts.beta[aliasName];
    totals.alpha += countAlpha;
    totals.beta += countBeta;
    out.push({
      indexName: aliasName,
      // eslint-disable-next-line sort-keys-fix/sort-keys-fix
      countAlpha,
      countBeta,
      diff: Math.abs(countAlpha - countBeta),
    });
  }

  const [nominator, denominator] = [totals.alpha, totals.beta].sort(
    (a, b) => a - b,
  );

  console.table(out);

  console.log(
    `Total Difference: ${Math.round(
      totals.alpha - totals.beta,
    )} (${nominator}/${denominator}) ${
      parseInt((nominator / denominator) * 10000) / 100
    }% `,
  );
})();
