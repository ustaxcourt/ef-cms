const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';

(async () => {
  const esClient = await getClient({ environmentName, version });

  const query = {
    body: {
      _source: ['pk.S', 'sk.S', 'preferredTrialCity.S'],
      query: {
        bool: {
          must: [
            {
              match: {
                'docketNumber.S': '1439-21',
              },
            },
          ],
        },
      },
    },
    index: 'efcms-case',
    size: 10000,
  };
  const results = await esClient.search(query);

  console.log(JSON.stringify(results.hits.hits, null, true));
})();
