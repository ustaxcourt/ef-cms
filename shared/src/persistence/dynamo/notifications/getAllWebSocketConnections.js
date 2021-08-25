const { queryFull } = require('../../dynamodbClientService');

/**
 * getAllWebSocketConnections
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Promise} the promise of the call to persistence
 */
//todo: add test
exports.getAllWebSocketConnections = ({ applicationContext }) =>
  queryFull({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':prefix': 'connection',
    },
    KeyConditionExpression: 'begins_with(#gsi1pk, :prefix)',
    applicationContext,
  });
