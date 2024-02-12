import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { cypressEnv } from '../env/cypressEnvironment';

let dynamoCache: DynamoDBClient;
let documentCache: DynamoDBDocument;

export function getDocumentClient(): DynamoDBDocument {
  if (!documentCache) {
    const dynamoEndpoint =
      cypressEnv.env === 'local' ? 'http://localhost:8000' : undefined;
    dynamoCache = new DynamoDBClient({
      credentials: {
        accessKeyId: cypressEnv.accessKeyId,
        secretAccessKey: cypressEnv.secretAccessKey,
        sessionToken: cypressEnv.sessionToken,
      },
      endpoint: dynamoEndpoint,
      region: cypressEnv.region,
    });
    documentCache = DynamoDBDocument.from(dynamoCache, {
      marshallOptions: { removeUndefinedValues: true },
    });
  }

  return documentCache;
}
