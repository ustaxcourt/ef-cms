import { chunk } from 'lodash';
import { createUsers } from '../../../web-api/storage/scripts/createUsers';
import { exec } from 'child_process';
import { refreshElasticsearchIndex } from '../helpers';
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

AWS.config = new AWS.Config();
AWS.config.region = 'us-east-1';

const client = new AWS.DynamoDB.DocumentClient({
  credentials: {
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
  },
  endpoint: process.env.DYNAMODB_ENDPOINT ?? 'http://localhost:8000',
  region: 'us-east-1',
});

const putEntries = async entries => {
  const chunks = chunk(entries, 25);
  for (let aChunk of chunks) {
    await client
      .batchWrite({
        RequestItems: {
          'efcms-local': aChunk.map(item => ({
            PutRequest: {
              Item: item,
            },
          })),
        },
      })
      .promise();
  }
};

const CHUNK_SIZE = 25;

export const clearDatabase = async () => {
  let hasMoreResults = true;
  let lastKey = null;
  while (hasMoreResults) {
    hasMoreResults = false;

    await client
      .scan({
        ExclusiveStartKey: lastKey,
        TableName: 'efcms-local',
      })
      .promise()
      .then(async results => {
        hasMoreResults = !!results.LastEvaluatedKey;
        lastKey = results.LastEvaluatedKey;

        const chunks = chunk(results.Items, CHUNK_SIZE);
        for (let c of chunks) {
          await client
            .batchWrite({
              RequestItems: {
                ['efcms-local']: c.map(item => ({
                  DeleteRequest: {
                    Key: {
                      pk: item.pk,
                      sk: item.sk,
                    },
                  },
                })),
              },
            })
            .promise();
        }
      });
  }
};

export const seedDatabase = async entries => {
  await clearDatabase();
  await resetElasticsearch();

  if (!entries) {
    await createUsers();
  }

  // we want to process the case entries LAST because we get stream errors otherwise
  entries.sort((a, b) => {
    const isACase = a.pk.includes('case|') && a.sk.includes('case|') ? 1 : 0;
    const isBCase = b.pk.includes('case|') && b.sk.includes('case|') ? 1 : 0;
    return isACase - isBCase;
  });

  return putEntries(entries);
};

export const seedFullDataset = async () => {
  const entries = JSON.parse(
    fs.readFileSync(
      path.join(
        __dirname,
        '../../../web-api/storage/fixtures/seed/efcms-local.json',
      ),
    ),
  );

  await seedDatabase(entries);

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
