const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';
const version = process.argv[3] || 'alpha';

(async () => {
  const esClient = await getClient({ environmentName, version });
  const section = 'docket';
  const query = {
    body: {
      query: {
        bool: {
          must: [
            {
              match: {
                'pk.S': `section|${section}`,
              },
            },
            {
              match: {
                'sk.S': 'work-item|',
              },
            },
            {
              term: {
                'section.S': {
                  value: section,
                },
              },
            },
            {
              exists: {
                field: 'completedAt.S',
              },
            },
          ],
        },
      },
    },
    index: 'efcms-work-item',
  };
  const results = await esClient.count(query);
  console.log(results);
})();
