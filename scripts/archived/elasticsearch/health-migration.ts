#!/usr/bin/env -S npx ts-node --transpile-only

import { Client } from '@opensearch-project/opensearch';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../../helpers/parseArgsAndEnvVars';
import { getBaseAliasFromIndexName } from '../../../web-api/elasticsearch/elasticsearch-aliases';
import { getClient } from '../../../web-api/elasticsearch/client';

const scriptConfig: ScriptConfig = {
  description:
    'health-migration - Compare index counts of the source and destination clusters',
  environment: {
    environmentName: 'ENV',
  },
  requireActiveAwsSession: true,
};
const { environmentName } = parseArgsAndEnvVars(scriptConfig) as {
  environmentName: string;
};
const esClientCache = {};

const getEsClient = async ({
  version,
}: {
  version: string;
}): Promise<Client> => {
  if (!esClientCache[version]) {
    esClientCache[version] = await getClient({ environmentName, version });
  }
  return esClientCache[version];
};

const getCounts = async ({
  indexName,
  version,
}: {
  indexName: string;
  version: string;
}): Promise<number> => {
  const esClient = await getEsClient({ version });
  const info = await esClient.count({
    index: indexName,
  });

  return info.body?.count || 0;
};

const listIndices = async ({
  version,
}: {
  version: string;
}): Promise<string[]> => {
  const esClient = await getEsClient({ version });
  const indices = await esClient.cat.indices({ format: 'json' });

  return indices.body
    .map(i => i.index)
    .filter(i => typeof i === 'string')
    .filter(i => {
      return i.includes('efcms');
    });
};

(async () => {
  const counts = { alpha: {}, beta: {} };
  const totals: { alpha: number; beta: number } = {
    alpha: 0,
    beta: 0,
  };
  const out: {
    countAlpha: number;
    countBeta: number;
    diff: number;
    indexName: string;
  }[] = [];

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
      countAlpha,
      countBeta,
      diff: Math.abs(countAlpha - countBeta),
    });
  }

  const [nominator, denominator] = [totals.alpha, totals.beta].sort(
    (a, b) => a - b,
  );

  console.log(`## ${environmentName} Index Summary`);
  console.table(out);
  console.log(
    `Total Difference: ${Math.round(
      totals.alpha - totals.beta,
    )} (${nominator}/${denominator}) ${
      ((nominator / denominator) * 10000) / 100
    }% `,
  );
})();
