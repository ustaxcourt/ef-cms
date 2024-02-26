import { getClient } from '../../../web-api/elasticsearch/client';
import { requireEnvVars } from '../util';

requireEnvVars(['ENV', 'SOURCE_TABLE_VERSION']);
const environmentName = process.env.ENV;
const version = process.env.SOURCE_TABLE_VERSION;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
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
  console.log(results.body);
})();
