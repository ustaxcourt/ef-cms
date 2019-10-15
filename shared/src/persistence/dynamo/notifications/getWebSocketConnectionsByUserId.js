const { query } = require('../../dynamodbClientService');

/**
 * getWebSocketConnectionsByUserId
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.userId the user id
 * @returns {Promise} the promise of the call to persistence
 */
exports.getWebSocketConnectionsByUserId = async ({
  applicationContext,
  userId,
}) => {
  return await query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `connections-${userId}`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });
};
