const {
  isAuthorized,
  GET_READ_MESSAGES,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * setMessageAsRead
 *
 * @param user
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.setMessageAsRead = async ({ applicationContext, messageId }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, GET_READ_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return applicationContext.getPersistenceGateway().setMessageAsRead({
    applicationContext,
    messageId,
    userId: user.userId,
  });
};
