import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
  ScanCommand,
  ScanCommandOutput,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Key } from 'aws-sdk/clients/dynamodb';
import { chunk } from 'lodash';
import { exec } from 'child_process';
import { putEntries } from '../../../web-api/storage/scripts/seedLocalDatabase';
import { refreshElasticsearchIndex } from '../helpers';
import { seedEntries } from '../../../web-api/storage/fixtures/seed/index';

const CHUNK_SIZE = 25;

export const clearDatabase = async () => {
  const client = new DynamoDBClient({
    credentials: {
      accessKeyId: 'S3RVER',
      secretAccessKey: 'S3RVER',
    },
    endpoint: 'http://localhost:8000',
    region: 'us-east-1',
  });

  const docClient = DynamoDBDocumentClient.from(client);

  let hasMoreResults = true;
  let lastKey: Key | undefined = undefined;

  while (hasMoreResults) {
    const command = new ScanCommand({
      ExclusiveStartKey: lastKey!,
      TableName: 'efcms-local',
    });

    const response: ScanCommandOutput = await docClient.send(command);

    hasMoreResults = !!response.LastEvaluatedKey;
    lastKey = response.LastEvaluatedKey;

    const chunks = chunk(response.Items, CHUNK_SIZE);

    for (let aChunk of chunks) {
      const deleteRequests = aChunk.map((item: any) => ({
        DeleteRequest: {
          Key: {
            pk: item.pk,
            sk: item.sk,
          },
        },
      }));

      await docClient.send(
        new BatchWriteCommand({
          RequestItems: {
            ['efcms-local']: deleteRequests,
          },
        }),
      );
    }
  }
};

export const seedDatabase = async entries => {
  await clearDatabase();
  await resetElasticsearch();

  // we want to process the case entries LAST because we get stream errors otherwise
  entries.sort((a, b) => {
    const isACase = a.pk.includes('case|') && a.sk.includes('case|') ? 1 : 0;
    const isBCase = b.pk.includes('case|') && b.sk.includes('case|') ? 1 : 0;
    return isACase - isBCase;
  });

  return putEntries(entries);
};

export const seedFullDataset = async () => {
  await seedDatabase(seedEntries);

  await refreshElasticsearchIndex();
};

export const resetElasticsearch = () => {
  return new Promise((resolve, reject) =>
    exec(
      'ELASTICSEARCH_ENDPOINT=http://localhost:9200 ELASTICSEARCH_HOST=localhost ./web-api/seed-elasticsearch.sh',
      (error, stdout) => {
        if (error) reject(error);
        resolve(stdout);
      },
    ),
  );
};
