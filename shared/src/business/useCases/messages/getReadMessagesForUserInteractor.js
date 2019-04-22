const {
  isAuthorized,
  GET_READ_MESSAGES,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * getReadMessagesForUser
 *
 * @param user
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getReadMessagesForUser = async ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, GET_READ_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return applicationContext.getPersistenceGateway().getReadMessagesForUser({
    applicationContext,
    userId: user.userId,
  });
};
