const { put } = require('./requests');

/**
 * updateCaseTrialSortTagsInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update the case trial sort tags
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateCaseTrialSortTagsInteractor = (
  applicationContext,
  { docketNumber },
) => {
  return put({
    applicationContext,
    endpoint: `/case-meta/${docketNumber}/update-case-trial-sort-tags`,
  });
};
