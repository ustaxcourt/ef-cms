const { query } = require('../../dynamodbClientService');

/**
 * getCasesByLeadCaseId
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.leadCaseId the lead case id
 * @returns {Promise} the promise of the call to persistence
 */
exports.getCasesByLeadCaseId = async ({ applicationContext, leadCaseId }) => {
  let casesByLeadCaseId = await query({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': `case|${leadCaseId}`,
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });

  const cases = await Promise.all(
    casesByLeadCaseId.map(({ caseId }) =>
      applicationContext.getPersistenceGateway().getCaseByCaseId({
        applicationContext,
        caseId,
      }),
    ),
  );

  return cases;
};
