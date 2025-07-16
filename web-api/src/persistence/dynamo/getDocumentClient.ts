import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { getDynamoClient } from '@web-api/persistence/dynamo/getDynamoClient';

export const getDocumentClient = (): DynamoDBDocument => {
  const dynamoClient = getDynamoClient();

  if (!documentClientCache) {
    const mainRegionDocumentClient = DynamoDBDocument.from(dynamoClient, {
      marshallOptions: { removeUndefinedValues: true },
    });
    documentClientCache = mainRegionDocumentClient;
  }

  return documentClientCache;
};

let documentClientCache: DynamoDBDocument | null = null;
