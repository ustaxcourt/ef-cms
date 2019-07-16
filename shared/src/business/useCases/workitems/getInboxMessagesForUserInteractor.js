const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getInboxMessagesForUserInteractor
 *
 * @param userId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getInboxMessagesForUserInteractor = async ({
  applicationContext,
  userId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const workItems = await applicationContext
    .getPersistenceGateway()
    .getInboxMessagesForUser({
      applicationContext,
      userId,
    });

  return workItems.filter(workItem => workItem.section === user.section);
};
