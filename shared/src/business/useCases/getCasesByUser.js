/**
 * getCasesByUser
 * @param userId
 * @param applicationContext
 * @returns {*|Promise<*>}
 */
exports.getCasesByUser = ({ userId, applicationContext }) => {
  return  applicationContext.getPersistenceGateway().getCasesByUser({
    userId,
    applicationContext,
  });
};
