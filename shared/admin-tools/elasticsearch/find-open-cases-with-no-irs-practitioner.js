const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';
const eventHorizon = '2021-02-20T05:00:00Z';

const findOpenCasesWithoutIrsPractitioner = async () => {
  const esClient = await getClient({ environmentName });
  const query = {
    body: {
      _source: ['docketNumber.S', 'irsPractitioners.L.M.userId.S'],
      query: {
        bool: {
          must: [
            {
              range: {
                'receivedAt.S': {
                  lte: eventHorizon,
                },
              },
            },
          ],
          must_not: [
            {
              term: {
                'status.S': 'Closed',
              },
            },
            {
              exists: {
                field: 'irsPractitioners',
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
  // console.log(results.hits.hits.map(hit => hit['_source']));
  // return [];

  return results.hits.hits
    .filter(hit => !hit['_source'].irsPractitioners)
    .map(hit => hit['_source'].docketNumber.S);
};

(async () => {
  const docketNumbers = await findOpenCasesWithoutIrsPractitioner();
  docketNumbers.forEach(num => console.log(num));
})();
