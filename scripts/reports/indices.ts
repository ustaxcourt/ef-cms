#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getClient } from '../../web-api/elasticsearch/client';

const scriptConfig: ScriptConfig = {
  description: 'indices - Lists elasticsearch indices, counts, and aliases.',
  environment: {
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
    environmentName: 'ENV',
  },
  requireActiveAwsSession: true,
};
const { elasticsearchEndpoint, environmentName } = parseArgsAndEnvVars(
  scriptConfig,
) as {
  elasticsearchEndpoint: string;
  environmentName: string;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const client = await getClient({ elasticsearchEndpoint, environmentName });
  const stats = await client.indices.stats({
    index: '_all',
    level: 'indices',
  });
  const counts = {};
  for (const index in stats.body?.indices) {
    const count = await client.count({ index });
    counts[index] = Number(count.body?.count || 0);
  }
  const aliases = {};
  (await client.cat.aliases({ format: 'json' })).body.forEach(a => {
    if (a.alias) {
      aliases[a.alias] = a.index;
    }
  });
  console.log('indices:', counts);
  console.log('aliases:', aliases);
})();
