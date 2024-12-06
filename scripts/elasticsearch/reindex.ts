#!/usr/bin/env npx ts-node --transpile-only

import { Client } from '@opensearch-project/opensearch';
import {
  type ScriptConfig,
  parseArgumentsAndEnvironmentVariables,
} from '../helpers/parseArgumentsAndEnvironmentVariables';
import { getClient } from '../../web-api/elasticsearch/client';
import { reindexIfNecessary } from './reindex.helpers';

const scriptConfig: ScriptConfig = {
  description: 'reindex - Starts reindexing if required',
  environment: {
    elasticsearchEndpoint: 'ELASTICSEARCH_ENDPOINT',
    environmentName: 'ENV',
  },
};
const { elasticsearchEndpoint, environmentName } =
  parseArgumentsAndEnvironmentVariables(scriptConfig) as {
    elasticsearchEndpoint: string;
    environmentName: string;
  };

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const client: Client = await getClient({
    elasticsearchEndpoint,
    environmentName,
  });

  await reindexIfNecessary({ client });
})();
