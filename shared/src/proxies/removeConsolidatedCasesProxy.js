const { remove } = require('./requests');

/**
 * removeConsolidatedCasesInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to consolidate
 * @param {Array} providers.docketNumbersToRemove the docket numbers of the cases to be removed from consolidation
 * @returns {Promise<*>} the promise of the api call
 */
exports.removeConsolidatedCasesInteractor = (
  applicationContext,
  { docketNumber, docketNumbersToRemove },
) => {
  const docketNumberList = docketNumbersToRemove.join(',');
  return remove({
    applicationContext,
    endpoint: `/case-meta/${docketNumber}/consolidate-case?docketNumbersToRemove=${docketNumberList}`,
  });
};
