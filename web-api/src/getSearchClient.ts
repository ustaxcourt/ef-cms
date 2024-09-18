import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws-v3';
import { Client } from '@opensearch-project/opensearch';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { environment } from './environment';

let searchClientCache: Client;

export function getSearchClient() {
  if (!searchClientCache) {
    if (environment.stage === 'local') {
      searchClientCache = new Client({
        node: environment.elasticsearchEndpoint,
      });
    } else {
      searchClientCache = new Client({
        ...AwsSigv4Signer({
          getCredentials: () => {
            const credentialsProvider = defaultProvider();
            return credentialsProvider();
          },
          region: 'us-east-1',
        }),
        node: `https://${environment.elasticsearchEndpoint}:443`,
      });
    }
  }
  return searchClientCache;
}
