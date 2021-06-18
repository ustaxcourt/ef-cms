const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';

(async () => {
  const esClient = await getClient({ environmentName });
  // const userId = 'd7d4bcfa-2abd-4055-b1b6-8e45af897759';
  const query = {
    body: {
      query: {
        term: {
          'pk.S': 'work-item|677659d1-2082-4a51-92b9-f637d660f3a6',
        },
      },
    },
    index: 'efcms-work-item',
  };
  const results = await esClient.search(query);
  results.hits.hits.forEach(item => {
    console.log(item['_source']);
  });
})();
