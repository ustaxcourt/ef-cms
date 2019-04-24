const client = require('../../dynamodbClientService');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');

exports.getReadMessagesForUser = async ({ userId, applicationContext }) => {
  const readMessage = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `${userId}|read-messages`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  return stripInternalKeys(readMessage);
};
