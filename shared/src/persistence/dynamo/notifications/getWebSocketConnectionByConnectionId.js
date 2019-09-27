const { query } = require('../../dynamodbClientService');

/**
 * getWebSocketConnectionByConnectionId
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.userId the user id
 * @returns {Promise} the promise of the call to persistence
 */
exports.getWebSocketConnectionByConnectionId = async ({
  applicationContext,
  connectionId,
}) => {
  let item;

  const items = await query({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': connectionId,
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });

  if (items && items.length) {
    item = items[0];
  }

  return item;
};
