/**
 * getCasesByUser
 * @param userId
 * @param applicationContext
 * @returns {*|Promise<*>}
 */
exports.getCasesByUser = ({ userId, applicationContext }) => {
  return applicationContext.persistence.getCasesByUser({
    userId,
    applicationContext,
  });
};
