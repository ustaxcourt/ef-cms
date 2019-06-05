const { query } = require('../../dynamodbClientService');

exports.getWorkItemsBySection = async ({ section, applicationContext }) => {
  return query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `section-${section}`,
      ':prefix': 'workitem',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });
};
