const { getClient } = require('../../../web-api/elasticsearch/client');

const environmentName = process.argv[2] || 'exp1';

(async () => {
  const esClient = await getClient({ environmentName });
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
    index: 'efcms-case',
  };
  const results = await esClient.count(query);
  console.log(results);
})();
