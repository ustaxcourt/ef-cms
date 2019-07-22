/**
 *
 * @param caseId
 * @param userId
 * @param applicationContext
 * @returns {Promise<*>}
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
