const client = require('../../dynamodbClientService');

exports.setMessageAsRead = async ({
  userId,
  messageId,
  applicationContext,
}) => {
  await client.delete({
    applicationContext,
    key: {
      pk: `${userId}|unread-message`,
      sk: messageId,
    },
  });
};
