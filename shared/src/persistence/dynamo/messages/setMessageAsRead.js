const client = require('../../dynamodbClientService');

exports.setMessageAsRead = async ({
  userId,
  messageId,
  applicationContext,
}) => {
  await client.put({
    Item: {
      pk: `${userId}|read-messages`,
      sk: messageId,
    },
    applicationContext,
  });
};
