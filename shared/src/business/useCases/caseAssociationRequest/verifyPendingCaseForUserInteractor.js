/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id to verify
 * @param {string} providers.userId the user id to verify
 * @returns {Promise<*>} the promise of the pending case verification
 */
exports.verifyPendingCaseForUserInteractor = async ({
  applicationContext,
  caseId,
  userId,
}) => {
  return await applicationContext
    .getPersistenceGateway()
    .verifyPendingCaseForUser({
      applicationContext,
      caseId,
      userId,
    });
};
