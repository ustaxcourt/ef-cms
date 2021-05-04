const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';

const findOpenCasesWithoutIrsPractitioner = async () => {
  const esClient = await getClient({ environmentName });
  const query = {
    body: {
      _source: ['docketNumber.S'],
      query: {
        bool: {
          must_not: [
            {
              term: {
                'status.S': 'Closed',
              },
            },
            {
              exists: {
                field: 'preferredTrialCity.S',
              },
            },
          ],
        },
      },
    },
    index: 'efcms-case',
    size: 5000,
  };
  const results = await esClient.search(query);
  console.log(results);

  return results.hits.hits.map(hit => hit['_source'].docketNumber.S);
};

(async () => {
  const docketNumbers = await findOpenCasesWithoutIrsPractitioner();
  docketNumbers.forEach(num => console.log(num));
})();
