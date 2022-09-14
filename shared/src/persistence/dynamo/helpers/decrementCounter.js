const client = require('../../dynamodbClientService');

/**
 * decrementCounter
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.pk the pk
 * @param {object} providers.sk the sk
 * @param {object} providers.counterKey the actual key to decrement
 * @returns {Promise} the promise of the call to persistence
 */
exports.decrementCounter = async ({
  applicationContext,
  counterKey,
  pk,
  sk,
}) => {
  return (
    await client.updateConsistent({
      ExpressionAttributeNames: {
        '#id': counterKey,
      },
      ExpressionAttributeValues: {
        ':value': -1,
      },
      Key: {
        pk,
        sk,
      },
      ReturnValues: 'UPDATED_NEW',
      UpdateExpression: 'ADD #id :value',
      applicationContext,
    })
  )[counterKey];
};
