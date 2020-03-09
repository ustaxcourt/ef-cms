const { getCaseDocketRecord } = require('./getCaseDocketRecord');
const { getCaseDocuments } = require('./getCaseDocuments');
const { getCasePractitioners } = require('./getCasePractitioners');
const { getCaseRespondents } = require('./getCaseRespondents');
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
  let items = await query({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': leadCaseId,
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });

  items = await Promise.all(
    items.map(getCaseDocketRecord({ applicationContext })),
  );
  items = await Promise.all(
    items.map(getCaseDocuments({ applicationContext })),
  );
  items = await Promise.all(
    items.map(getCasePractitioners({ applicationContext })),
  );
  items = await Promise.all(
    items.map(getCaseRespondents({ applicationContext })),
  );

  return items;
};
