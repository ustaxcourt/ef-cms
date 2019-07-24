/**
 *
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
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
