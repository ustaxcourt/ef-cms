const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getDocumentQCServedForUser
 *
 * @param userId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getDocumentQCServedForUser = async ({ applicationContext, userId }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const workItems = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCServedForUser({
      applicationContext,
      userId,
    });

  return workItems;
};
