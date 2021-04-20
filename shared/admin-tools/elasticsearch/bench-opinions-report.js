const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';

const findBenchOpinions = async (start, end) => {
  const esClient = await getClient({ environmentName, version });
  const query = {
    body: {
      _source: ['pk.S', 'sk.S'],
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
                  gte: start,
                  lte: end,
                },
              },
            },
          ],
        },
      },
    },
    index: 'efcms-docket-entry',
    size: 10000,
  };
  const results = await esClient.search(query);
  if (results.length >= 10000) {
    throw 'too many results';
  }

  return results.hits.hits.map(hit => hit['_source'].pk.S.split('|')[1]);
};

(async () => {
  const docketNumbers = await findBenchOpinions(
    '2021-03-01T00:00:00Z',
    '2021-04-01T00:00:00Z',
  );
  console.log(docketNumbers);
})();
