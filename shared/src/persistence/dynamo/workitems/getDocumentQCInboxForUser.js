const { query } = require('../../dynamodbClientService');

exports.getDocumentQCInboxForUser = async ({ applicationContext, userId }) => {
  const workItems = await query({
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
  console.log('workItems', workItems);
  return workItems.filter(workItem => !workItem.isInternal);
};
