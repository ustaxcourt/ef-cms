const {
  GET_READ_MESSAGES,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * setWorkItemAsReadInteractor
 *
 * @param user
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.setWorkItemAsReadInteractor = async ({
  applicationContext,
  workItemId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, GET_READ_MESSAGES)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return applicationContext.getPersistenceGateway().setWorkItemAsRead({
    applicationContext,
    userId: user.userId,
    workItemId,
  });
};
