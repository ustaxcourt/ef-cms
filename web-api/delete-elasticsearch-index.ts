import { elasticsearchIndexes } from './elasticsearch/elasticsearch-indexes';
import { getClient } from './elasticsearch/client';
import { requireEnvVars } from '../shared/admin-tools/util';

requireEnvVars(['ELASTICSEARCH_ENDPOINT', 'ENV']);

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const openSearchClient = await getClient({
    elasticsearchEndpoint: process.env.ELASTICSEARCH_ENDPOINT!,
    environmentName: process.env.ENV!,
  });

  await Promise.all(
    elasticsearchIndexes.map(async index => {
      try {
        const indexExists = await openSearchClient.indices.exists({
          index,
        });
        if (indexExists) {
          return openSearchClient.indices.delete({
            index,
          });
        }
      } catch (e) {
        console.log(e);
      }
    }),
  );
})();
