import { Client } from '@opensearch-project/opensearch';
import { environment } from '@web-api/environment';
import { getClient, getHost } from './client';
import { getDestinationTableName } from 'shared/admin-tools/util';
import { setupAliases } from './elasticsearch-alias-settings.helpers';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const environmentName: string = environment.stage;

  const { version } = await getDestinationTableName();
  const destinationDomain = `efcms-search-${environment.stage}-${version}`;
  const elasticsearchEndpoint = await getHost(destinationDomain);

  const client: Client = await getClient({
    elasticsearchEndpoint,
    environmentName,
  });

  await setupAliases({ client });
})();
