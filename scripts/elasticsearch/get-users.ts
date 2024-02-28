import { getClient } from '../../web-api/elasticsearch/client';
import { requireEnvVars } from '../../shared/admin-tools/util';

requireEnvVars(['ENV', 'SOURCE_TABLE_VERSION']);
const environmentName = process.env.ENV!;
const version = process.env.SOURCE_TABLE_VERSION!;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const esClient = await getClient({ environmentName, version });
  const role = 'general';
  const query = {
    body: {
      query: {
        match: {
          'role.S': role,
        },
      },
    },
    index: 'efcms-user',
  };
  const results = await esClient.search(query);
  console.log(results.body.hits.hits.map(hit => hit['_source']['email']['S']));
})();
