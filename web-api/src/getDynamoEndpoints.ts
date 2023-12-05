import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { getDynamoClient } from '@web-api/persistence/dynamo/getDynamoClient';

let mainRegionDocumentClient: DynamoDBDocument,
  fallbackRegionDocumentClient: DynamoDBDocument;

export const getDynamoEndpoints = ({
  environment,
}: {
  environment: any;
}): {
  fallbackRegionDocumentClient: DynamoDBDocument;
  mainRegionDocumentClient: DynamoDBDocument;
} => {
  if (!mainRegionDocumentClient) {
    const mainRegionDb = getDynamoClient({
      environment,
      useMasterRegion: true,
    });
    const fallbackRegionDb = getDynamoClient({
      environment,
      useMasterRegion: false,
    });

    mainRegionDocumentClient = DynamoDBDocument.from(mainRegionDb, {
      marshallOptions: { removeUndefinedValues: true },
    });
    fallbackRegionDocumentClient = DynamoDBDocument.from(fallbackRegionDb, {
      marshallOptions: { removeUndefinedValues: true },
    });
  }

  return { fallbackRegionDocumentClient, mainRegionDocumentClient };
};
