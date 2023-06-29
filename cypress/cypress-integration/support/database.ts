import { chunk } from 'lodash';
import AWS from 'aws-sdk';

AWS.config = new AWS.Config();
AWS.config.region = 'us-east-1';

import { seedLocalDatabase } from '../../../web-api/storage/scripts/seedLocalDatabase';

const documentClient = new AWS.DynamoDB.DocumentClient({
  credentials: {
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
  },
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
});

const CHUNK_SIZE = 25;

const clearDatabase = async () => {
  let hasMoreResults = true;
  let lastKey = null;
  let count = 0;
  while (hasMoreResults) {
    hasMoreResults = false;

    await documentClient
      .scan({
        ExclusiveStartKey: lastKey,
        TableName: 'efcms-local',
      })
      .promise()
      .then(async results => {
        hasMoreResults = !!results.LastEvaluatedKey;
        lastKey = results.LastEvaluatedKey;

        const chunks = chunk(
          results.Items.filter(i => i.length > 0),
          CHUNK_SIZE,
        );
        for (let c of chunks) {
          count += CHUNK_SIZE;
          console.log(`deleting chunk: ${count} total deleted`);

          await documentClient
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

export const getEmailVerificationToken = async ({ userId }) => {
  return await documentClient
    .get({
      Key: {
        pk: `user|${userId}`,
        sk: `user|${userId}`,
      },
      TableName: 'efcms-local',
    })
    .promise()
    .then(result => {
      return result.Item.pendingEmailVerificationToken;
    });
};

export const setAllowedTerminalIpAddresses = async ipAddresses => {
  return await documentClient
    .put({
      Item: {
        ips: ipAddresses,
        pk: 'allowed-terminal-ips',
        sk: 'allowed-terminal-ips',
      },
      TableName: 'efcms-local',
    })
    .promise();
};

export const reseedDatabase = async () => {
  await clearDatabase();
  await seedLocalDatabase();
  return null;
};
