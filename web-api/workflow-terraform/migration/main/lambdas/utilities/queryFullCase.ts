import type { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

export const queryFullCase = async (
  documentClient: DynamoDBDocument,
  docketNumber: string,
): Promise<Record<string, any>[]> => {
  let hasMoreResults = true;
  let lastKey: Record<string, any> | undefined;
  let allResults: Record<string, any>[] = [];
  while (hasMoreResults) {
    hasMoreResults = false;

    const subsetResults = await documentClient.query({
      ExclusiveStartKey: lastKey,
      ExpressionAttributeNames: {
        '#pk': 'pk',
      },
      ExpressionAttributeValues: {
        ':pk': `case|${docketNumber}`,
      },
      KeyConditionExpression: '#pk = :pk',
      TableName: process.env.SOURCE_TABLE,
    });

    hasMoreResults = !!subsetResults.LastEvaluatedKey;
    lastKey = subsetResults.LastEvaluatedKey;
    if (subsetResults.Items) {
      allResults = [...allResults, ...subsetResults.Items];
    }
  }

  return allResults;
};
