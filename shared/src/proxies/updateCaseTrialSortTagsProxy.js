const { put } = require('./requests');

/**
 * updateCaseTrialSortTagsInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to update the case trial sort tags
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateCaseTrialSortTagsInteractor = ({
  applicationContext,
  caseId,
}) => {
  return put({
    applicationContext,
    endpoint: `/case-meta/${caseId}/update-case-trial-sort-tags`,
  });
};
