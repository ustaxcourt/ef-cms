const { remove } = require('./requests');

/**
 * removeConsolidatedCasesInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case to consolidate
 * @param {Array} providers.caseIdsToRemove the ids of the cases to be removed from consolidation
 * @returns {Promise<*>} the promise of the api call
 */
exports.removeConsolidatedCasesInteractor = ({
  applicationContext,
  caseIdsToRemove,
  docketNumber,
}) => {
  const caseIdList = caseIdsToRemove.join(',');
  return remove({
    applicationContext,
    endpoint: `/case-meta/${docketNumber}/consolidate-case?caseIdsToRemove=${caseIdList}`,
  });
};
