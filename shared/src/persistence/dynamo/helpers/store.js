const client = require('../../dynamodbClientService');

/**
 * incrementKeyCount
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.key the key of the item to increment
 * @returns {Promise} the promise of the call to persistence
 */
exports.incrementKeyCount = ({ applicationContext, key }) =>
  client.updateConsistent({
    ExpressionAttributeNames: {
      '#id': 'id',
    },
    ExpressionAttributeValues: {
      ':value': 1,
    },
    Key: {
      pk: `${key}`,
      sk: `${key}`,
    },
    ReturnValues: 'ALL_NEW',
    UpdateExpression: 'ADD #id :value',
    applicationContext,
  });

/**
 * setExpiresAt
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.key the key of the item to increment
 * @param {string} providers.expiresAt the expiresAt of the item
 * @returns {Promise} the promise of the call to persistence
 */
exports.setExpiresAt = ({ applicationContext, expiresAt, key }) =>
  client.updateConsistent({
    ExpressionAttributeNames: {
      '#expiresAt': 'expiresAt',
      '#id': 'id',
    },
    ExpressionAttributeValues: {
      ':id': 1,
      ':value': expiresAt,
    },
    Key: {
      pk: `${key}`,
      sk: `${key}`,
    },
    ReturnValues: 'ALL_NEW',
    UpdateExpression: 'SET #expiresAt = :value, #id = :id',
    applicationContext,
  });

exports.deleteKeyCount = ({ applicationContext, key }) =>
  client.delete({ applicationContext, key: { pk: key, sk: key } });
