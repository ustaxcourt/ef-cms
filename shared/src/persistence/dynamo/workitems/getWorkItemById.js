const client = require('../../dynamodbClientService');

exports.getWorkItemById = ({ applicationContext, workItemId }) => {
  return client.query({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': `work-item|${workItemId}`,
      ':sk': `work-item|${workItemId}`,
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk and #sk = :sk',
    applicationContext,
  })[0];
};
