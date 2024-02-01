import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const awsRegion = 'us-east-1';
const stage = process.env.CYPRESS_STAGE || 'local';
const accessKeyId = process.env.CYPRESS_AWS_ACCESS_KEY_ID || 'S3RVER';
const secretAccessKey = process.env.CYPRESS_AWS_ACCESS_KEY_ID || 'S3RVER';
const dynamoEndpoint = stage === 'local' ? 'http://localhost:8000' : undefined;

let dynamoCache: DynamoDBClient;
let documentCache: DynamoDBDocument;

export function getDocumentClient(): DynamoDBDocument {
  if (!documentCache) {
    dynamoCache = new DynamoDBClient({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      endpoint: dynamoEndpoint,
      region: awsRegion,
    });
    documentCache = DynamoDBDocument.from(dynamoCache, {
      marshallOptions: { removeUndefinedValues: true },
    });
  }

  return documentCache;
}
