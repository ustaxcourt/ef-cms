<<<<<<< HEAD
=======
const {
  getCasePrivatePractitioners,
} = require('./getCasePrivatePractitioners');
const { getCaseDocketRecord } = require('./getCaseDocketRecord');
const { getCaseDocuments } = require('./getCaseDocuments');
const { getCaseIrsPractitioners } = require('./getCaseIrsPractitioners');
>>>>>>> develop
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

<<<<<<< HEAD
  for (let i = 0; i < items.length; i++) {
    items[i] = {
      ...items[i],
      ...(await applicationContext.getPersistenceGateway().getCaseByCaseId({
        applicationContext,
        caseId: items[i].caseId,
      })),
    };
  }
=======
  items = await Promise.all(
    items.map(getCaseDocketRecord({ applicationContext })),
  );
  items = await Promise.all(
    items.map(getCaseDocuments({ applicationContext })),
  );
  items = await Promise.all(
    items.map(getCasePrivatePractitioners({ applicationContext })),
  );
  items = await Promise.all(
    items.map(getCaseIrsPractitioners({ applicationContext })),
  );
>>>>>>> develop

  return items;
};
