import { getClient } from '../../web-api/elasticsearch/client';
import { requireEnvVars } from '../../shared/admin-tools/util';

requireEnvVars(['ENV', 'SOURCE_TABLE_VERSION']);
const environmentName = process.env.ENV!;
const version = process.env.SOURCE_TABLE_VERSION!;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const esClient = await getClient({ environmentName, version });

  let results = await esClient.search({
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
