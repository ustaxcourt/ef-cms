/**
 *
 * @param caseId
 * @param userId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.verifyPendingCaseForUser = async ({
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
