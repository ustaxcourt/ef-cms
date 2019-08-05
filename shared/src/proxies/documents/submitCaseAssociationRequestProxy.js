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
  representingPrimary,
  representingSecondary,
}) => {
  const user = applicationContext.getCurrentUser();
  return put({
    applicationContext,
    body: {
      representingPrimary,
      representingSecondary,
    },
    endpoint: `/users/${user.userId}/case/${caseId}`,
  });
};
