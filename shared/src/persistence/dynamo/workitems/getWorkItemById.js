const client = require('../../dynamodbClientService');

exports.getWorkItemById = async ({ applicationContext, workItemId }) => {
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
