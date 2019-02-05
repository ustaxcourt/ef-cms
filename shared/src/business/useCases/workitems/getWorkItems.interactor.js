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
exports.getWorkItems = async ({ applicationContext }) => {
  const userId = applicationContext.getCurrentUser().userId;
  if (!isAuthorized(userId, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let workItems = await applicationContext
    .getPersistenceGateway()
    .getWorkItemsForUser({
      userId,
      applicationContext,
    });

  if (!workItems) {
    workItems = [];
  }

  return workItems;
};
