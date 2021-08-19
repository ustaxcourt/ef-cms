const { query } = require('../../dynamodbClientService');

/**
 * getMessagesByDocketNumber
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {object} the created message
 */
exports.getMessagesByDocketNumber = ({ applicationContext, docketNumber }) =>
  query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `case|${docketNumber}`,
      ':prefix': 'message|',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });
