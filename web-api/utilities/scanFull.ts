import { Key } from 'aws-sdk/clients/dynamodb';
import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import type { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

export const scanFull = async (
  tableName: string,
  documentClient: DynamoDBDocument,
): Promise<TDynamoRecord[]> => {
  let items: TDynamoRecord[] = [];
  let hasMoreResults = true;
  let lastKey: Key | undefined = undefined;

  while (hasMoreResults) {
    hasMoreResults = false;

    await documentClient
      .scan({
        ExclusiveStartKey: lastKey,
        TableName: tableName,
      })
      .then(results => {
        hasMoreResults = !!results.LastEvaluatedKey;
        lastKey = results.LastEvaluatedKey;
        items = [...items, ...(results.Items as TDynamoRecord[])];
      });
  }

  return items;
};
