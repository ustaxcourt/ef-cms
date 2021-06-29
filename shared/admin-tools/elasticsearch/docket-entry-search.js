const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';

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

  results.hits.hits.forEach(hit => {
    console.log(hit['_source']);
  });

  console.log(`total hits: ${results.hits.hits.length}`);
})();
