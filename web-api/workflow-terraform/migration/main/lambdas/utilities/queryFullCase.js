export const queryFullCase = async (documentClient, docketNumber) => {
  let hasMoreResults = true;
  let lastKey = null;
  let allResults = [];
  while (hasMoreResults) {
    hasMoreResults = false;

    const subsetResults = await documentClient
      .query({
        ExclusiveStartKey: lastKey,
        ExpressionAttributeNames: {
          '#pk': 'pk',
        },
        ExpressionAttributeValues: {
          ':pk': `case|${docketNumber}`,
        },
        KeyConditionExpression: '#pk = :pk',
        TableName: process.env.SOURCE_TABLE,
      })
      .promise();

    hasMoreResults = !!subsetResults.LastEvaluatedKey;
    lastKey = subsetResults.LastEvaluatedKey;

    allResults = [...allResults, ...subsetResults.Items];
  }

  return allResults;
};
