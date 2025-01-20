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
  const section = 'docket';
  const query = {
    body: {
      query: {
        bool: {
          must: [
            {
              match: {
                'pk.S': `section|${section}`,
              },
            },
            {
              match: {
                'sk.S': 'work-item|',
              },
            },
            {
              term: {
                'section.S': {
                  value: section,
                },
              },
            },
            {
              exists: {
                field: 'completedAt.S',
              },
            },
          ],
        },
      },
    },
    index: 'efcms-work-item',
  };
  const results = await esClient.count(query);
  console.log(results.body);
})();
