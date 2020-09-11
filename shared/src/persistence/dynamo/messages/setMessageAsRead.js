const client = require('../../dynamodbClientService');

exports.setMessageAsRead = async ({
  applicationContext,
  docketNumber,
  messageId,
}) => {
  await client.update({
    ExpressionAttributeNames: {
      '#isRead': 'isRead',
    },
    ExpressionAttributeValues: {
      ':isRead': true,
    },
    Key: {
      pk: `case|${docketNumber}`,
      sk: `message|${messageId}`,
    },
    UpdateExpression: 'SET #isRead = :isRead',
    applicationContext,
  });
};
