const client = require('../../dynamodbClientService');

exports.setWorkItemAsRead = async ({
  applicationContext,
  userId,
  workItemId,
}) => {
  await client.update({
    ExpressionAttributeNames: {
      '#isRead': 'isRead',
    },
    ExpressionAttributeValues: {
      ':isRead': true,
    },
    Key: {
      pk: `user|${userId}`,
      sk: `work-item|${workItemId}`,
    },
    UpdateExpression: 'SET #isRead = :isRead',
    applicationContext,
  });
};
