const { put } = require('../../dynamodbClientService');

const TIME_TO_EXIST = 60 * 60 * 24;

/**
 * saveUserConnection
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.connectionId the websocket connection id
 * @param {string} providers.endpoint the websocket endpoint url
 * @param {string} providers.userId the user id
 * @returns {Promise} the promise of the call to persistence
 */
exports.saveUserConnection = ({
  applicationContext,
  connectionId,
  endpoint,
  userId,
}) =>
  Promise.all([
    put({
      Item: {
        connectionId,
        endpoint,
        gsi1pk: 'connection',
        pk: `user|${userId}`,
        sk: `connection|${connectionId}`,
        ttl: Math.floor(Date.now() / 1000) + TIME_TO_EXIST,
        userId,
      },
      applicationContext,
    }),
    put({
      Item: {
        connectionId,
        endpoint,
        pk: `connection|${connectionId}`,
        sk: `connection|${connectionId}`,
        ttl: Math.floor(Date.now() / 1000) + TIME_TO_EXIST,
        userId,
      },
      applicationContext,
    }),
  ]);
