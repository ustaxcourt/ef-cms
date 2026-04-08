import { Client } from '@opensearch-project/opensearch';
import { environment } from '@web-api/environment';
import { getClient, getHost } from './client';
// import { getDestinationVersionInfo } from '@shared-admin-tools/util';
import { getDestinationVersionInfo } from 'shared/admin-tools/util';
import { setupAliases } from './elasticsearch-alias-settings.helpers';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
  const environmentName: string = environment.stage;
  let elasticsearchEndpoint: string = process.argv[2];
  if (!elasticsearchEndpoint) {
    const { version } = await getDestinationVersionInfo();
    const destinationDomain = `efcms-search-${environment.stage}-${version}`;
    elasticsearchEndpoint = (await getHost(destinationDomain))!;
  }

  const client: Client = await getClient({
    elasticsearchEndpoint,
    environmentName,
  });

  await setupAliases({ client });
})();
