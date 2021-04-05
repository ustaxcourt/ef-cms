const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';

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
  console.log(results.hits.hits.map(hit => hit['_source']['email']['S']));
})();
