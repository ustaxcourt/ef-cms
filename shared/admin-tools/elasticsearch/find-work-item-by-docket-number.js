const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';

(async () => {
  const esClient = await getClient({ environmentName });
  const docketNumber = '8626-21';
  const query = {
    body: {
      query: {
        term: {
          'docketNumber.S': docketNumber,
        },
      },
    },
    index: 'efcms-work-item',
  };
  const results = await esClient.search(query);
  results.hits.hits.forEach(item => {
    console.log({
      entityName: item['_source'].entityName.S,
      pk: item['_source'].pk.S,
      sk: item['_source'].sk.S,
    });
  });
})();
