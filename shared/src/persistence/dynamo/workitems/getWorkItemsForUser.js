const { query } = require('../../dynamodbClientService');

exports.getWorkItemsForUser = async ({ applicationContext, userId }) => {
  return query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `user-${userId}`,
      ':prefix': 'workitem',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });
};
