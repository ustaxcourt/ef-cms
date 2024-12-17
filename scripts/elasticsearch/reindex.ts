#!/usr/bin/env -S npx ts-node --transpile-only

import { Client } from '@opensearch-project/opensearch';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../helpers/parseArgsAndEnvVars';
import { getClient } from '../../web-api/elasticsearch/client';
import { reindexIfNecessary } from './reindex.helpers';

const scriptConfig: ScriptConfig = {
  description: 'reindex - Starts reindexing if required',
  environment: {
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
    environmentName: 'ENV',
  },
  requireActiveAwsSession: true,
};
const { elasticsearchEndpoint, environmentName } = parseArgsAndEnvVars(
  scriptConfig,
) as { elasticsearchEndpoint: string; environmentName: string };

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const client: Client = await getClient({
    elasticsearchEndpoint,
    environmentName,
  });

  await reindexIfNecessary({ client });
})();
