const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param section
 * @param applicationContext
 * @returns {Promise<*|*>}
 */
exports.getSentWorkItemsForSection = async ({
  applicationContext,
  section,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized for getting sent work items');
  }

  const workItems = await applicationContext
    .getPersistenceGateway()
    .getSentWorkItemsForSection({
      applicationContext,
      section,
    });

  return workItems;
};
