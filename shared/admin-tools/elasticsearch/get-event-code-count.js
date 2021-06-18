const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';

const getCountOfEventCode = async eventCode => {
  const esClient = await getClient({ environmentName });
  const query = {
    body: {
      query: {
        bool: {
          must: [
            {
              match: {
                'eventCode.S': eventCode,
              },
            },
          ],
        },
      },
    },
    index: 'efcms-docket-entry',
  };
  const results = await esClient.count(query);
  console.log(results);
};

(async () => {
  await getCountOfEventCode([
    'OOD',
    'OSC',
    'OAD',
    'DEC',
    'NOT',
    'OD',
    'O',
    'ODJ',
  ]);
})();
