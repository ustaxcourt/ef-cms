const { query } = require('../../dynamodbClientService');

/**
 * getCaseMessagesByCaseId
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case
 * @returns {object} the created case message
 */
exports.getCaseMessagesByCaseId = async ({ applicationContext, caseId }) => {
  return await query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `case|${caseId}`,
      ':prefix': 'message|',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });
};
