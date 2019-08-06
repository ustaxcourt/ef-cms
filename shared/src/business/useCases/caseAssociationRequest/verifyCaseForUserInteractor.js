/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the case id to verify
 * @param {string} providers.userId the user id to verify
 * @returns {Promise<*>} the promise of the case verification
 */
exports.verifyCaseForUserInteractor = async ({
  applicationContext,
  caseId,
  userId,
}) => {
  return await applicationContext.getPersistenceGateway().verifyCaseForUser({
    applicationContext,
    caseId,
    userId,
  });
};
