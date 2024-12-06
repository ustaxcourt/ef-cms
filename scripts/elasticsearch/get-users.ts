#!/usr/bin/env npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgumentsAndEnvironmentVariables,
} from '../helpers/parseArgumentsAndEnvironmentVariables';
import { getClient } from '../../web-api/elasticsearch/client';

const scriptConfig: ScriptConfig = {
  environment: {
    environmentName: 'ENV',
    version: 'SOURCE_TABLE_VERSION',
  },
};
const { environmentName, version } = parseArgumentsAndEnvironmentVariables(
  scriptConfig,
) as { environmentName: string; version: string };

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const esClient = await getClient({ environmentName, version });
  const role = 'general';
  const query = {
    body: {
      query: {
        match: {
          'role.S': role,
        },
      },
    },
    index: 'efcms-user',
  };
  const results = await esClient.search(query);
  console.log(results.body.hits.hits.map(hit => hit['_source']['email']['S']));
})();
