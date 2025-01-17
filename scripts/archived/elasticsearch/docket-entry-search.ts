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

  const results = await esClient.search({
    body: {
      _source: [
        'docketNumber',
        'docketEntryId',
        'pk',
        'sk',
        'filingDate',
        'eventCode',
      ],
      query: {
        bool: {
          must: [
            {
              match: {
                'eventCode.S': 'OST',
              },
            },
            {
              range: {
                'filingDate.S': {
                  format: 'strict_date_time', // ISO-8601 time stamp
                  gte: '2020-11-19T00:00:00.103-05:00',
                },
              },
            },
            {
              range: {
                'filingDate.S': {
                  format: 'strict_date_time', // ISO-8601 time stamp
                  lte: '2021-01-09T00:00:00.103-05:00',
                },
              },
            },
          ],
        },
      },
    },
    index: 'efcms-docket-entry',
    size: 10000,
  });

  results.body.hits.hits.forEach(hit => {
    console.log(hit['_source']);
  });

  console.log(`total hits: ${results.body.hits.hits.length}`);
})();
