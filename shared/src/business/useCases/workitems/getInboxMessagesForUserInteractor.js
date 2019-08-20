const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * getInboxMessagesForUserInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.userId the user to get the inbox messages
 * @returns {object} the messages in the user inbox
 */
exports.getInboxMessagesForUserInteractor = async ({
  applicationContext,
  userId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const workItems = await applicationContext
    .getPersistenceGateway()
    .getInboxMessagesForUser({
      applicationContext,
      userId,
    });

  return workItems.filter(workItem => workItem.section === user.section);
};
