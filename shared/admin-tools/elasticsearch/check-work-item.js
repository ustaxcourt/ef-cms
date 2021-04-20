const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';

const userId = '173f09a5-0775-454d-9be7-45abab3539fe';

const findWorkItemInfo = async () => {
  const esClient = await getClient({ environmentName, version });
  const query = {
    body: {
      // _source: ['pk.S', 'sk.S'],
      query: {
        bool: {
          must: [
            {
              term: {
                'pk.S': `user|${userId}`,
              },
            },
          ],
          must_not: {
            exists: {
              field: 'completedAt.S',
            },
          },
          should: [
            {
              term: {
                'highPriority.BOOL': {
                  boost: 500,
                  value: true,
                },
              },
            },
          ],
        },
      },
    },
    index: 'efcms-work-item',
    size: 10000,
  };
  const results = await esClient.search(query);
  console.log(results);
  results.hits.hits.map(hit => console.log(hit));

  return true;

  // return results.hits.hits.map(hit => hit['_source'].pk.S.split('|')[1]);
};

(async () => {
  await findWorkItemInfo();
})();
