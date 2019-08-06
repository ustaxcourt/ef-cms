const client = require('../../dynamodbClientService');

/**
 * incrementCounter
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.key the key of the item to increment
 * @returns {Promise} the promise of the call to persistence
 */
exports.incrementCounter = ({ applicationContext, key }) => {
  const year = new Date().getFullYear().toString();

  return client.updateConsistent({
    ExpressionAttributeNames: {
      '#a': 'id',
    },
    ExpressionAttributeValues: {
      ':x': 1,
    },
    Key: {
      pk: `${key}-${year}`,
      sk: `${key}-${year}`,
    },
    ReturnValues: 'UPDATED_NEW',
    UpdateExpression: 'ADD #a :x',
    applicationContext,
  });
};
