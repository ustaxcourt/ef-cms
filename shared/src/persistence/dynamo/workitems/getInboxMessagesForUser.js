const { query } = require('../../dynamodbClientService');

exports.getInboxMessagesForUser = async ({ applicationContext, userId }) => {
  const workItems = await query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `user|${userId}`,
      ':prefix': 'work-item',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });
  return workItems.filter(
    workItem => !workItem.completedAt && workItem.assigneeId === userId,
  );
};
