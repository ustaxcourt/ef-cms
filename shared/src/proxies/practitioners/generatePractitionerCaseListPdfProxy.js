const { get } = require('../requests');

/**
 * generatePractitionerCaseListPdfInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.associatedJudge the judge to filter by
 * @param {string} providers.status the status to filter by
 * @returns {Promise<*>} the promise of the api call
 */
exports.generatePractitionerCaseListPdfInteractor = (
  applicationContext,
  { userId },
) => {
  return get({
    applicationContext,
    endpoint: `/practitioners/${userId}/printable-case-list`,
  });
};
