const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';

const findOpenWhistleBlowerCases = async () => {
  const esClient = await getClient({ environmentName });
  const query = {
    body: {
      _source: ['docketNumber.S'],
      query: {
        bool: {
          must: [
            {
              term: {
                'docketNumberSuffix.S': 'W',
              },
            },
          ],
          must_not: [
            {
              term: {
                'status.S': 'Closed',
              },
            },
          ],
        },
      },
      sort: [{ 'sortableDocketNumber.N': { order: 'asc' } }],
    },
    index: 'efcms-case',
    size: 5000,
  };
  const results = await esClient.search(query);
  console.log(results);

  return results.hits.hits.map(hit => hit['_source'].docketNumber.S);
};

(async () => {
  const docketNumbers = await findOpenWhistleBlowerCases();
  docketNumbers.forEach(num => console.log(num));
})();
