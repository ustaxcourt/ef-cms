#!/usr/bin/env -S npx ts-node --transpile-only

import {
  type ScriptConfig,
  parseArgsAndEnvVars,
} from '../../helpers/parseArgsAndEnvVars';
import { getClient } from '../../../web-api/elasticsearch/client';

const scriptConfig: ScriptConfig = {
  environment: {
    environmentName: 'ENV',
    version: 'SOURCE_TABLE_VERSION',
  },
  requireActiveAwsSession: true,
};
const { environmentName, version } = parseArgsAndEnvVars(scriptConfig) as {
  environmentName: string;
  version: string;
};

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
  console.log(results.body.hits.hits.map(hit => hit._source?.email?.S));
})();
