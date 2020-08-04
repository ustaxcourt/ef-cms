const { put } = require('../requests');

/**
 * updateCaseDeadlineInteractorProxy
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseDeadline the case deadline data
 * @returns {Promise<*>} the promise of the api call
 */
exports.updateCaseDeadlineInteractor = ({
  applicationContext,
  caseDeadline,
}) => {
  return put({
    applicationContext,
    body: { caseDeadline },
    endpoint: `/case-deadlines/${caseDeadline.docketNumber}/${caseDeadline.caseDeadlineId}`,
  });
};
