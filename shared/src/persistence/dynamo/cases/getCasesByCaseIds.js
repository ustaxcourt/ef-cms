const client = require('../../dynamodbClientService');

/**
 * getCasesByCaseIds
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Array} providers.caseIds the case ids to get
 * @returns {Array} the case details
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
