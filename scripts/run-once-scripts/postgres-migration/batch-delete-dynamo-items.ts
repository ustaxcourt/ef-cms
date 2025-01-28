import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';

export async function batchDeleteDynamoItems(
  itemsToDelete: { DeleteRequest: { Key: { pk: string; sk?: string } } }[],
  client: DynamoDBDocumentClient,
  tableNameInput: string,
): Promise<number> {
  const BATCH_SIZE = 25;
  const RETRY_DELAY_MS = 5000; // Set the delay between retries (in milliseconds)
  let totalItemsDeleted = 0;

  for (let i = 0; i < itemsToDelete.length; i += BATCH_SIZE) {
    const batch = itemsToDelete.slice(i, i + BATCH_SIZE);

    const batchWriteParams = {
      RequestItems: {
        [tableNameInput]: batch,
      },
    };

    try {
      let unprocessedItems: any[] = batch;
      let retryCount = 0;
      const MAX_RETRIES = 5;

      // Retry logic for unprocessed items
      while (unprocessedItems.length > 0 && retryCount < MAX_RETRIES) {
        const response = await client.send(
          new BatchWriteCommand(batchWriteParams),
        );

        totalItemsDeleted +=
          unprocessedItems.length -
          (response.UnprocessedItems?.[tableNameInput]?.length || 0);

        unprocessedItems = response.UnprocessedItems?.[tableNameInput] ?? [];

        if (unprocessedItems.length > 0) {
          console.log(
            `Retrying unprocessed items: ${unprocessedItems.length}, attempt ${retryCount + 1}`,
          );
          batchWriteParams.RequestItems[tableNameInput] = unprocessedItems;
          retryCount++;

          // Add delay before the next retry
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        }
      }

      if (unprocessedItems.length > 0) {
        console.error(
          `Failed to delete ${unprocessedItems.length} items after ${MAX_RETRIES} retries.`,
        );
      }
    } catch (error) {
      console.error('Error in batch delete:', error);
    }
  }
  return totalItemsDeleted;
}
