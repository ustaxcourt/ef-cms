import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { chunk } from 'lodash';
import { getCypressEnv } from '../env/cypressEnvironment';
import type {
  DeleteRequest,
  PutRequest,
} from '@web-api/persistence/dynamo/dynamoTypes';

let dynamoCache: DynamoDBClient;
let documentCache: DynamoDBDocument;

export function getDocumentClient(): DynamoDBDocument {
  if (!documentCache) {
    const dynamoEndpoint =
      getCypressEnv().env === 'local' ? 'http://localhost:8000' : undefined;
    dynamoCache = new DynamoDBClient({
      credentials: {
        accessKeyId: getCypressEnv().accessKeyId,
        secretAccessKey: getCypressEnv().secretAccessKey,
        sessionToken: getCypressEnv().sessionToken,
      },
      endpoint: dynamoEndpoint,
      region: getCypressEnv().region,
    });
    documentCache = DynamoDBDocument.from(dynamoCache, {
      marshallOptions: { removeUndefinedValues: true },
    });
  }

  return documentCache;
}

export const batchWrite = async (
  commands: (DeleteRequest | PutRequest)[],
): Promise<void> => {
  if (!commands.length) return;

  const documentClient = getDocumentClient();
  const chunks = chunk(commands, 25);

  await Promise.all(
    chunks.map(commandChunk =>
      documentClient.batchWrite({
        RequestItems: {
          [getCypressEnv().dynamoDbTableName]: commandChunk,
        },
      }),
    ),
  );

  return;
};
