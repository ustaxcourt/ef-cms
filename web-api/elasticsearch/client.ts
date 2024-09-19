import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws-v3';
import { Client } from '@opensearch-project/opensearch';
import {
  DescribeDomainCommand,
  OpenSearchClient,
} from '@aws-sdk/client-opensearch';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { getSourceTableInfo } from '../../shared/admin-tools/util';

export const getHost = async (
  DomainName: string,
): Promise<string | undefined> => {
  const openSearchClient = new OpenSearchClient({ region: 'us-east-1' });
  const describeDomainCommand: DescribeDomainCommand =
    new DescribeDomainCommand({ DomainName });
  const describeDomainResponse = await openSearchClient.send(
    describeDomainCommand,
  );
  return describeDomainResponse.DomainStatus?.Endpoint || undefined;
};

export const getClient = async ({
  elasticsearchEndpoint,
  environmentName,
  version,
}: {
  elasticsearchEndpoint?: string;
  environmentName: string;
  version?: string;
}): Promise<Client> => {
  if (!elasticsearchEndpoint) {
    version = version || (await getSourceTableInfo()).version;
    const domainName =
      version === 'info'
        ? 'info'
        : `efcms-search-${environmentName}-${version}`;
    const host = await getHost(domainName);
    elasticsearchEndpoint = `https://${host}:443`;
  } else {
    if (environmentName !== 'local') {
      elasticsearchEndpoint = `https://${elasticsearchEndpoint}:443`;
    }
  }

  return environmentName === 'local'
    ? new Client({ node: elasticsearchEndpoint })
    : new Client({
        ...AwsSigv4Signer({
          getCredentials: () => {
            const credentialsProvider = defaultProvider();
            return credentialsProvider();
          },
          region: 'us-east-1',
        }),
        node: elasticsearchEndpoint,
      });
};
