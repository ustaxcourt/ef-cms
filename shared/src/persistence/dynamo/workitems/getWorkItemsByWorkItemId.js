const client = require('../../dynamodbClientService');

// TODO wait, what are these things we're fetching here?
exports.getWorkItemsByWorkItemId = ({ applicationContext, workItemId }) =>
  client.query({
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
