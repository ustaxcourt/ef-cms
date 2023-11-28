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

    mainRegionDocumentClient = DynamoDBDocument.from(mainRegionDb); // To-do No cache for document client. icky icky mcSticky.
    fallbackRegionDocumentClient = DynamoDBDocument.from(fallbackRegionDb);
  }

  return { fallbackRegionDocumentClient, mainRegionDocumentClient };
};
