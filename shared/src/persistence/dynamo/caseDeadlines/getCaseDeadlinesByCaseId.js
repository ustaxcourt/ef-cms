const {
  getRecordsViaMapping,
} = require('../../dynamo/helpers/getRecordsViaMapping');

/**
 * getCaseDeadlinesByCaseId
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to get the case deadlines for
 * @returns {Promise} the promise of the persistence call to get the records
 */
exports.getCaseDeadlinesByCaseId = async ({ applicationContext, caseId }) => {
  return await getRecordsViaMapping({
    applicationContext,
    pk: `case|${caseId}`,
    prefix: 'case-deadline',
  });
};
