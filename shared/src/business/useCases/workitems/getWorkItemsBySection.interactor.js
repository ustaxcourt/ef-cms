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
exports.getWorkItemsBySection = async ({ section, applicationContext }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  let workItems = await applicationContext
    .getPersistenceGateway()
    .getWorkItemsBySection({
      section,
      applicationContext,
    });

  if (!workItems) {
    workItems = [];
  }

  return workItems;
};
