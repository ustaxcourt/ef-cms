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
      pk: `user-${userId}`,
      sk: `workitem-${workItemId}`,
    },
    UpdateExpression: `SET #isRead = :isRead`,
    applicationContext,
  });
};
