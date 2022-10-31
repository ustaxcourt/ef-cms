const client = require('../../dynamodbClientService');

export const getWorkItemById = async ({
  applicationContext,
  workItemId,
}: {
  applicationContext: IApplicationContext;
  workItemId: string;
}) => {
  const results = await client.query({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': `work-item|${workItemId}`,
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });

  return results.find(result => result.pk.startsWith('case|'));
};
