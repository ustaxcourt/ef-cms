import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import fs from 'fs';

const dynamoClient = new DynamoDBClient({
  credentials: {
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER',
  },
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
});
const documentClient = DynamoDBDocument.from(dynamoClient, {
  marshallOptions: { removeUndefinedValues: true },
});

export const setAllowedTerminalIpAddresses = async (ipAddresses: string[]) => {
  return await documentClient.put({
    Item: {
      ips: ipAddresses,
      pk: 'allowed-terminal-ips',
      sk: 'allowed-terminal-ips',
    },
    TableName: 'efcms-local',
  });
};

export const deleteAllFilesInFolder = (directoryPath: string) => {
  if (!fs.existsSync(directoryPath)) return null;
  fs.rmSync(directoryPath, { recursive: true });
  return null;
};

export const ensureFolderExists = (directory: string) => {
  if (fs.existsSync(directory)) return null;
  fs.mkdirSync(directory);
  return null;
};
