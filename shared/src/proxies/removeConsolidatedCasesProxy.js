const { remove } = require('./requests');

/**
 * removeConsolidatedCasesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to consolidate
 * @param {Array} providers.caseIdsToRemove the ids of the cases to be removed from consolidation
 * @returns {Promise<*>} the promise of the api call
 */
exports.removeConsolidatedCasesInteractor = ({
  applicationContext,
  caseId,
  caseIdsToRemove,
}) => {
  const caseIdList = caseIdsToRemove.join(',');
  return remove({
    applicationContext,
    endpoint: `/case-meta/${caseId}/consolidate-case?caseIdsToRemove=${caseIdList}`,
  });
};
