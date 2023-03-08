const { put } = require('./requests');

/**
 * updateCaseDetailsProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {string} providers.caseDetails the case details to update for the case
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateCaseDetailsInteractor = (
  applicationContext,
  { caseDetails, docketNumber },
) => {
  return put({
    applicationContext,
    body: {
      caseDetails,
    },
    endpoint: `/case-parties/${docketNumber}/case-details`,
  });
};
