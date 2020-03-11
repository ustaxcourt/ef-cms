const { query } = require('../../dynamodbClientService');

/**
 * getCasePractitioners
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {Function} async function to be used in an array.map
 */
exports.getCasePractitioners = ({ applicationContext }) => async theCase => ({
  ...theCase,
  practitioners: await query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `case|${theCase.caseId}`,
      ':prefix': 'practitioner',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  }),
});
