const { remove } = require('../requests');

/**
 * deleteCaseDeadlineInteractorProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.caseDeadlineId the id of the case deadline to remove
 * @param {string} providers.docketNumber the docket number of the case containing the case deadline to remove
 * @returns {Promise<*>} the promise of the api call
 */
exports.deleteCaseDeadlineInteractor = (
  applicationContext,
  { caseDeadlineId, docketNumber },
) => {
  return remove({
    applicationContext,
    endpoint: `/case-deadlines/${docketNumber}/${caseDeadlineId}`,
  });
};
