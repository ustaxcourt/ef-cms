import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { fallbackHandler } from '@web-api/fallbackHandler';

export const getDocumentClient = (
  applicationContext: IApplicationContext,
  { useMainRegion = false } = {},
): DynamoDBDocument => {
  const type = useMainRegion ? 'master' : 'region';

  const mainRegionDb = applicationContext.getDynamoClient({
    environment: applicationContext.environment,
    useMainRegion: true,
  });
  const fallbackRegionDb = applicationContext.getDynamoClient({
    environment: applicationContext.environment,
    useMainRegion: false,
  });

  if (!dynamoClientCache[type]) {
    const mainRegionDocumentClient = DynamoDBDocument.from(mainRegionDb, {
      marshallOptions: { removeUndefinedValues: true },
    });
    const fallbackRegionDocumentClient = DynamoDBDocument.from(
      fallbackRegionDb,
      {
        marshallOptions: { removeUndefinedValues: true },
      },
    );
    dynamoClientCache.master = {
      batchGet: fallbackHandler({
        dynamoMethod: 'batchGet',
        fallbackRegionDocumentClient,
        mainRegionDocumentClient,
      }),
      batchWrite: fallbackHandler({
        dynamoMethod: 'batchWrite',
        fallbackRegionDocumentClient,
        mainRegionDocumentClient,
      }),
      delete: fallbackHandler({
        dynamoMethod: 'delete',
        fallbackRegionDocumentClient,
        mainRegionDocumentClient,
      }),
      get: fallbackHandler({
        dynamoMethod: 'get',
        fallbackRegionDocumentClient,
        mainRegionDocumentClient,
      }),
      put: fallbackHandler({
        dynamoMethod: 'put',
        fallbackRegionDocumentClient,
        mainRegionDocumentClient,
      }),
      query: fallbackHandler({
        dynamoMethod: 'query',
        fallbackRegionDocumentClient,
        mainRegionDocumentClient,
      }),
      scan: fallbackHandler({
        dynamoMethod: 'scan',
        fallbackRegionDocumentClient,
        mainRegionDocumentClient,
      }),
      update: fallbackHandler({
        dynamoMethod: 'update',
        fallbackRegionDocumentClient,
        mainRegionDocumentClient,
      }),
    };
    dynamoClientCache.region = {
      batchGet: fallbackHandler({
        dynamoMethod: 'batchGet',
        fallbackRegionDocumentClient,
        mainRegionDocumentClient,
      }),
      batchWrite: fallbackHandler({
        dynamoMethod: 'batchWrite',
        fallbackRegionDocumentClient,
        mainRegionDocumentClient,
      }),
      delete: fallbackHandler({
        dynamoMethod: 'delete',
        fallbackRegionDocumentClient,
        mainRegionDocumentClient,
      }),
      get: fallbackHandler({
        dynamoMethod: 'get',
        fallbackRegionDocumentClient,
        mainRegionDocumentClient,
      }),
      put: fallbackHandler({
        dynamoMethod: 'put',
        fallbackRegionDocumentClient,
        mainRegionDocumentClient,
      }),
      query: fallbackHandler({
        dynamoMethod: 'query',
        fallbackRegionDocumentClient,
        mainRegionDocumentClient,
      }),
      scan: fallbackHandler({
        dynamoMethod: 'scan',
        fallbackRegionDocumentClient,
        mainRegionDocumentClient,
      }),
      update: fallbackHandler({
        dynamoMethod: 'update',
        fallbackRegionDocumentClient,
        mainRegionDocumentClient,
      }),
    };
  }

  return dynamoClientCache[type];
};

let dynamoClientCache: Record<string, DynamoDBDocument> = {};
