import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import { Client } from '@opensearch-project/opensearch';
import {
  DescribeDomainCommand,
  ListDomainNamesCommand,
  OpenSearchClient,
} from '@aws-sdk/client-opensearch';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { getSourceTableVersion } from '../../shared/admin-tools/util';

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
    version = version || (await getSourceTableVersion());
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

export const listDomains = async (): Promise<string[]> => {
  const openSearchClient = new OpenSearchClient({ region: 'us-east-1' });
  const listDomainsCommand: ListDomainNamesCommand = new ListDomainNamesCommand(
    { EngineType: 'OpenSearch' || 'Elasticsearch' },
  );
  const listDomainsResponse = await openSearchClient.send(listDomainsCommand);
  const domainNames: string[] = [];
  if (listDomainsResponse.DomainNames) {
    for (const domainInfo of listDomainsResponse.DomainNames) {
      if (domainInfo.DomainName) {
        domainNames.push(domainInfo.DomainName);
      }
    }
  }
  return domainNames;
};
