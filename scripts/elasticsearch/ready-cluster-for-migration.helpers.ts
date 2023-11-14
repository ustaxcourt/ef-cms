import {
  DescribeDomainCommand,
  OpenSearchClient,
} from '@aws-sdk/client-opensearch';
import { esAliasType } from '../../web-api/elasticsearch/elasticsearch-aliases';
import { esIndexType } from '../../web-api/elasticsearch/elasticsearch-indexes';
import { getClient } from '../../web-api/elasticsearch/client';

export const checkIfExists = async (DomainName: string): Promise<boolean> => {
  const client = new OpenSearchClient({ region: 'us-east-1' });
  const input = {
    DomainName,
  };

  try {
    const command = new DescribeDomainCommand(input);
    await client.send(command);
    return true;
  } catch (err: any) {
    if (err.Code === 'ResourceNotFoundException') {
      return false;
    }
    throw err;
  }
};

export const checkIfEmpty = async (client: {
  count: ({ body }) => Promise<{ body: { count: number } }>;
}): Promise<boolean> => {
  const body = {
    query: {
      bool: {
        must_not: {
          term: {
            type: {
              value: 'config',
            },
          },
        },
      },
    },
  };

  const res = await client.count({
    body,
  });

  return res.body.count === 0;
};

export const getClientForDomainName = async (DomainName: string) => {
  const [, , ENV, VERSION]: string[] = DomainName.split('-');
  if (!ENV || !VERSION) {
    console.error('Invalid Domain Name specified');
    return;
  }
  return await getClient({ environmentName: ENV, version: VERSION });
};

export const readyClusterForMigration = async (DomainName?: string) => {
  if (!DomainName) {
    console.error('Please provide an Opensearch Domain to check');
    return;
  }

  const exists = await checkIfExists(DomainName);
  if (!exists) {
    return;
  }

  const client = await getClientForDomainName(DomainName);
  if (!client) {
    return;
  }

  const isEmpty = await checkIfEmpty(client);
  if (!isEmpty) {
    // get the count for the domain
    console.log('cluster is NOT empty; exiting with status code 1');
    process.exit(1);
  }

  // if the cluster is empty, just delete the indices and aliases
  // as they will be recreated soon with latest and greatest mappings

  const aliases = await client.cat.aliases({ format: 'json' });
  await Promise.all(
    aliases.body?.map((alias: esAliasType) =>
      client.indices.deleteAlias({
        index: alias.index,
        name: alias.alias,
      }),
    ),
  );

  const indices = await client.cat.indices({ format: 'json' });
  await Promise.all(
    indices.body?.map((index: esIndexType) =>
      client.indices.delete({ index: index.index }),
    ),
  );
};
