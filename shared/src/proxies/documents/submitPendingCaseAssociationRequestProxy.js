const { put } = require('../requests');

/**
 * submitPendingCaseAssociationRequestInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id
 * @returns {Promise<*>} the promise of the api call
 */
exports.submitPendingCaseAssociationRequestInteractor = ({
  applicationContext,
  caseId,
}) => {
  const user = applicationContext.getCurrentUser();
  return put({
    applicationContext,
    endpoint: `/users/${user.userId}/case/${caseId}/pending`,
  });
};
