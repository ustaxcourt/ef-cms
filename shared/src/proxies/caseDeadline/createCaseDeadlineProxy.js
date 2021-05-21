const { post } = require('../requests');

/**
 * createCaseDeadlineInteractorProxy
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.caseDeadline the case deadline data
 * @returns {Promise<*>} the promise of the api call
 */
exports.createCaseDeadlineInteractor = (
  applicationContext,
  { caseDeadline },
) => {
  return post({
    applicationContext,
    body: { caseDeadline },
    endpoint: `/case-deadlines/${caseDeadline.docketNumber}`,
  });
};
