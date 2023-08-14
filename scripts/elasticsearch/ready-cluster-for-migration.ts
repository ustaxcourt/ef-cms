import {
  DescribeDomainCommand,
  OpenSearchClient,
} from '@aws-sdk/client-opensearch';
import { elasticsearchIndexes } from '../../web-api/elasticsearch/elasticsearch-indexes';
import { getClient } from '../../web-api/elasticsearch/client';

export const deleteIfExists = async ({ client, index }) => {
  const indexExists = await client.indices.exists({ body: {}, index });
  if (indexExists.statusCode === 404) {
    return;
  }

  await client.indices.delete({ body: {}, index });
};

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

export const readyClusterForMigration = async client => {
  const isEmpty = await checkIfEmpty(client);
  if (!isEmpty) {
    // get the count for the domain
    console.log('cluster is NOT empty; exiting with status code 1');
    process.exit(1);
  }

  // if the clust er is empty, just delete the indices as they will be recreated soon
  // with latest and greatest mappings
  await Promise.all(
    elasticsearchIndexes.map(index => deleteIfExists({ client, index })),
  );
};

(async () => {
  if (!process.argv[2]) {
    console.log('Please provide an Opensearch Domain to check');
    return;
  }

  const DomainName: string = process.argv[2];

  const exists = await checkIfExists(DomainName);

  if (!exists) {
    // doesn't exist; nothing to do -- we are ready for a migration!
    return;
  }

  // exists; make sure it's ready for a migration
  const [, , ENV, VERSION]: string[] = DomainName.split('-');
  const client = await getClient({ environmentName: ENV, version: VERSION });
  await readyClusterForMigration(client);
})();
