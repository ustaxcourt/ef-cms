const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';

(async () => {
  const esClient = await getClient({ environmentName, version });
  const userId = '131ee4e6-cffa-4b33-ae58-d4b357b1e3a1';
  const query = {
    body: {
      query: {
        bool: {
          must: [
            {
              term: {
                'docketNumber.S': '22401-18'
                // 'pk.S': `user|${userId}`,
              },
            },
          ],
        },
      },
    },
    index: 'efcms-user-case',
    size: 10000,
  };
  const results = await esClient.search(query);

  console.log(JSON.stringify(results.hits.hits, null, true));
})();
