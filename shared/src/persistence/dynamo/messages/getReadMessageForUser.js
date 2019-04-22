const client = require('../../dynamodbClientService');

exports.getReadMessagesForUser = async ({ userId, applicationContext }) => {
  return client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `${userId}|read-messages`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });
};
