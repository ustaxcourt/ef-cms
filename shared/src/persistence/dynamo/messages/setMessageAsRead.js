const client = require('../../dynamodbClientService');

exports.setMessageAsRead = async ({
  applicationContext,
  messageId,
  userId,
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
      sk: `message|${messageId}`,
    },
    UpdateExpression: 'SET #isRead = :isRead',
    applicationContext,
  });
};
