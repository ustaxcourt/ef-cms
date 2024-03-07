import { elasticsearchIndexes } from './elasticsearch/elasticsearch-indexes';
import { getClient } from './elasticsearch/client';
import { requireEnvVars } from '../shared/admin-tools/util';

requireEnvVars(['ELASTICSEARCH_ENDPOINT', 'ENV']);

(async () => {
  const openSearchClient = await getClient({
    elasticsearchEndpoint: process.env.ELASTICSEARCH_ENDPOINT,
    environmentName: process.env.ENV,
  });

  await Promise.all(
    elasticsearchIndexes.map(async index => {
      try {
        const indexExists = await openSearchClient.indices.exists({
          body: {},
          index,
        });
        if (indexExists) {
          openSearchClient.indices.delete({
            index,
          });
        }
      } catch (e) {
        console.log(e);
      }
    }),
  );
})();
