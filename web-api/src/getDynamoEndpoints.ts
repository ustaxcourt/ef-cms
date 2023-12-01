import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

let mainRegionDocumentClient: DynamoDBDocument,
  fallbackRegionDocumentClient: DynamoDBDocument;

export const getDynamoEndpoints = ({
  getDynamoClient,
}: {
  getDynamoClient: ({
    useMasterRegion,
  }: {
    useMasterRegion: boolean;
  }) => DynamoDBClient;
}): {
  fallbackRegionDocumentClient: DynamoDBDocument;
  mainRegionDocumentClient: DynamoDBDocument;
} => {
  if (!mainRegionDocumentClient) {
    const mainRegionDb = getDynamoClient({ useMasterRegion: true });
    const fallbackRegionDb = getDynamoClient({ useMasterRegion: false });

    mainRegionDocumentClient = DynamoDBDocument.from(mainRegionDb, {
      marshallOptions: { removeUndefinedValues: true },
    });
    fallbackRegionDocumentClient = DynamoDBDocument.from(fallbackRegionDb, {
      marshallOptions: { removeUndefinedValues: true },
    });
  }

  return { fallbackRegionDocumentClient, mainRegionDocumentClient };
};
