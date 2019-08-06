const { get } = require('./requests');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id to verify
 * @param {string} providers.userId the user id to verify
 * @returns {Promise<*>} the promise of the api call
 */
exports.verifyPendingCaseForUserInteractor = ({
  applicationContext,
  caseId,
}) => {
  const user = applicationContext.getCurrentUser();
  return get({
    applicationContext,
    endpoint: `/users/${user.userId}/case/${caseId}/pending`,
  });
};
