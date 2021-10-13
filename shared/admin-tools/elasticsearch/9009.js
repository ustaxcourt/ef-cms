const { getClient } = require('../../../web-api/elasticsearch/client');
const { getVersion } = require('..//util');

const environmentName = process.argv[2] || 'exp1';
const userId = process.argv[3];

(async () => {
  const version = await getVersion();
  const esClient = await getClient({ environmentName, version });

  // verify in efcms-user records are not present for given irsPractitioner userId
  const query = {
    body: {
      query: {
        bool: {
          must: [
            {
              match: {
                'role.S': 'irsPractitioner',
              },
            },
            {
              match: {
                'pk.S': `user|${userId}`,
              },
            },
          ],
        },
      },
    },
    index: 'efcms-user',
  };

  const results = await esClient.count(query);

  console.log(results);
})();
