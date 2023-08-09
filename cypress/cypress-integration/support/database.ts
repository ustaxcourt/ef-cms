import AWS from 'aws-sdk';

AWS.config = new AWS.Config();
AWS.config.region = 'us-east-1';

const documentClient = new AWS.DynamoDB.DocumentClient({
  credentials: {
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
  },
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
});

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
