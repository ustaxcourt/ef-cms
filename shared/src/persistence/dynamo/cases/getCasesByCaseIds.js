const client = require('../../dynamodbClientService');

/**
 * getCaseByCaseId
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id to get
 * @returns {object} the case details
 */
exports.getCasesByCaseIds = async ({ applicationContext, caseIds }) => {
  return await client.batchGet({
    applicationContext,
    keys: caseIds.map(id => ({
      pk: `case|${id}`,
      sk: `case|${id}`,
    })),
  });
};
