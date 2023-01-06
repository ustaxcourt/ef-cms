import { chunk } from 'lodash';
import AWS from 'aws-sdk';
import fs from 'fs';

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
  let count = 0;
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
          count += CHUNK_SIZE;
          console.log(`deleting chunk: ${count} total deleted`);

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

export const seedDatabase = filePath => {
  const entries = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return putEntries(entries);
};
