const client = require('../../dynamodbClientService');

exports.setWorkItemAsRead = async ({
  userId,
  workItemId,
  applicationContext,
}) => {
  await client.update({
    ExpressionAttributeNames: {
      '#isRead': 'isRead',
    },
    ExpressionAttributeValues: {
      ':isRead': true,
    },
    Key: {
      pk: `user-${userId}`,
      sk: `workitem-${workItemId}`,
    },
    UpdateExpression: `SET #isRead = :isRead`,
    applicationContext,
  });
};
