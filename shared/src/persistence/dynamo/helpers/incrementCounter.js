const client = require('../../dynamodbClientService');
const {
  getMonthDayYearObj,
} = require('../../../business/utilities/DateHandler');
/**
 * incrementCounter
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.key the key of the item to increment
 * @param {string} providers.year the year of the item to increment, formatted as YYYY
 * @returns {Promise} the promise of the call to persistence
 */
exports.incrementCounter = async ({ applicationContext, key, year }) => {
  if (!year) {
    year = `${getMonthDayYearObj().year}`;
  }

  return (
    await client.updateConsistent({
      ExpressionAttributeNames: {
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':value': 1,
      },
      Key: {
        pk: `${key}-${year}`,
        sk: `${key}-${year}`,
      },
      ReturnValues: 'UPDATED_NEW',
      UpdateExpression: 'ADD #id :value',
      applicationContext,
    })
  ).id;
};
