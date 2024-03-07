import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

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

export const getEmailVerificationToken = async ({
  userId,
}: {
  userId: string;
}) => {
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
      return result.Item?.pendingEmailVerificationToken;
    });
};

export const setAllowedTerminalIpAddresses = async (ipAddresses: string[]) => {
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

export const deleteAllFilesInFolder = (directoryPath: string) => {
  if (!fs.existsSync(directoryPath)) return null;
  const files = fs.readdirSync(directoryPath);
  files.forEach(file => {
    const filePath = path.join(directoryPath, file);
    fs.unlinkSync(filePath);
  });
  return null;
};
