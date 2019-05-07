const client = require('../../dynamodbClientService');
const { stripInternalKeys } = require('../helpers/stripInternalKeys');

exports.getUnreadMessagesForUser = async ({ userId, applicationContext }) => {
  const unreadMessages = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `${userId}|unread-message`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  return stripInternalKeys(unreadMessages);
};
