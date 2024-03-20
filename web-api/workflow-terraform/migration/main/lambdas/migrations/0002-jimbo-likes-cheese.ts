import type { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';

export const migrateItems = async (
  items: TDynamoRecord[],
): Promise<TDynamoRecord[]> => {
  return items.map(item => ({ ...item, likesCheese: true }));
};
