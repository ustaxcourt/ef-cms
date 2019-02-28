const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getWorkItems
 *
 * @param userId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getWorkItemsForUser = async ({ applicationContext }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let workItems = await applicationContext
    .getPersistenceGateway()
    .getWorkItemsForUser({
      userId: user.userId,
      applicationContext,
    });

  if (!workItems) {
    workItems = [];
  }

  return workItems;
};
