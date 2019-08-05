const { post } = require('../requests');

/**
 * associatePractitionerWithCaseInteractorProxy
 *
 * @param applicationContext
 * @param caseId
 * @param userId
 * @returns {Promise<*>}
 */
exports.associatePractitionerWithCaseInteractor = ({
  applicationContext,
  caseId,
  representingPrimary,
  representingSecondary,
  userId,
}) => {
  return post({
    applicationContext,
    body: { caseId, representingPrimary, representingSecondary, userId },
    endpoint: `/cases/${caseId}/associate-practitioner`,
  });
};
