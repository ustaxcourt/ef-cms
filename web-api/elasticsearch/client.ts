import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import { Client } from '@opensearch-project/opensearch';
import { DomainInfoList } from 'aws-sdk/clients/es';
import { getVersion } from '../../shared/admin-tools/util';
import AWS from 'aws-sdk';

const es = new AWS.ES({
  region: 'us-east-1',
});

export const getHost = async (
  DomainName: string,
): Promise<string | undefined> => {
  try {
    const result = await es
      .describeElasticsearchDomain({
        DomainName,
      })
      .promise();
    return result.DomainStatus.Endpoint;
  } catch (err) {
    console.error(`could not find resource for ${DomainName}`, err);
  }
  return;
};

export const getClient = async ({
  environmentName,
  version,
}: {
  environmentName: string;
  version: string;
}): Promise<Client> => {
  version = version || (await getVersion());
  const domainName =
    version === 'info' ? 'info' : `efcms-search-${environmentName}-${version}`;
  const host = await getHost(domainName);

  return new Client({
    ...AwsSigv4Signer({
      getCredentials: () =>
        new Promise((resolve, reject) => {
          AWS.config.getCredentials((err, credentials) => {
            if (err) {
              reject(err);
            } else {
              if (credentials) {
                resolve(credentials);
              }
            }
          });
        }),

      region: 'us-east-1',
    }),
    node: `https://${host}:443`,
  });
};

export const listDomains = async (): Promise<DomainInfoList | undefined> => {
  try {
    const res = await es.listDomainNames().promise();
    return res.DomainNames;
  } catch (err) {
    console.error('unable to list elasticsearch domains', err);
  }
  return;
};
