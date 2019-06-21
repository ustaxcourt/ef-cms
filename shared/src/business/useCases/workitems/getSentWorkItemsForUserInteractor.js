const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param applicationContext
 * @returns {Promise<*|*>}
 */
exports.getSentWorkItemsForUser = async ({ applicationContext, userId }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, WORKITEM, userId)) {
    throw new UnauthorizedError(
      'Unauthorized for getting completed work items',
    );
  }

  const workItems = await applicationContext
    .getPersistenceGateway()
    .getSentWorkItemsForUser({
      applicationContext,
      userId,
    });

  return workItems;
};
