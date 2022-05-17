const { query } = require('../../dynamodbClientService');

/**
 * getDispatchNotification
 *
 * @param {object} providers
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.topic the topic of the dispatch being sent
 * @returns {array} an array of the results returned by the query
 */
exports.getDispatchNotification = async ({ applicationContext, topic }) =>
  query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
      '#ttl': 'ttl',
    },
    ExpressionAttributeValues: {
      ':currentEpoch': Date.now() / 1000,
      ':pk': 'dispatch-notification',
      ':sk': topic,
    },
    FilterExpression: '#ttl >= :currentEpoch',
    KeyConditionExpression: '#pk = :pk AND #sk = :sk',
    applicationContext,
  });
