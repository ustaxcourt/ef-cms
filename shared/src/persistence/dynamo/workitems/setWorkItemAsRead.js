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
      pk: `${userId}|workItem`,
      sk: workItemId,
    },
    UpdateExpression: `SET #isRead = :isRead`,
    applicationContext,
  });
};
