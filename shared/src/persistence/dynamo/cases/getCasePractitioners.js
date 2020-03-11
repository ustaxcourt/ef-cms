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
  privatePractitioners: await query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `case|${theCase.caseId}`,
      ':prefix': 'privatePractitioner',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  }),
});
