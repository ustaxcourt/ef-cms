const { put } = require('../requests');

/**
 * submitCaseAssociationRequestInteractor
 *
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.submitCaseAssociationRequestInteractor = ({
  applicationContext,
  caseId,
}) => {
  const user = applicationContext.getCurrentUser();
  return put({
    applicationContext,
    endpoint: `/users/${user.userId}/case/${caseId}`,
  });
};
