const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getDocumentQCBatchedForUser
 *
 * @param userId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getDocumentQCBatchedForUser = async ({
  applicationContext,
  userId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const workItems = await applicationContext
    .getPersistenceGateway()
    .getDocumentQCBatchedForUser({
      applicationContext,
      userId,
    });

  return workItems;
};
