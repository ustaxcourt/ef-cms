const AWS = require('aws-sdk');
const { chunk } = require('lodash');

AWS.config = new AWS.Config();
AWS.config.accessKeyId = 'S3RVER';
AWS.config.secretAccessKey = 'S3RVER';
AWS.config.region = 'us-east-1';

const {
  seedLocalDatabase,
} = require('../../web-api/storage/scripts/seedLocalDatabase');

const documentClient = new AWS.DynamoDB.DocumentClient({
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

module.exports.getEmailVerificationToken = async ({ userId }) => {
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

module.exports.setAllowedTerminalIpAddresses = async ipAddresses => {
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

module.exports.reseedDatabase = async () => {
  await clearDatabase();
  await seedLocalDatabase();
  return null;
};
