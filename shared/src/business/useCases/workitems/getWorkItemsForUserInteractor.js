const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const { WorkItem } = require('../../entities/WorkItem');

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

  const workItems = await applicationContext
    .getPersistenceGateway()
    .getWorkItemsForUser({
      applicationContext,
      userId: user.userId,
    });

  const readMessages = await applicationContext
    .getPersistenceGateway()
    .getReadMessagesForUser({
      applicationContext,
      userId: user.userId,
    });

  workItems.forEach(workItem => {
    const message = new WorkItem(workItem).getLatestMessageEntity();
    let isRead = false;
    if (
      readMessages.find(
        readMessage => readMessage.messageId === message.messageId,
      )
    ) {
      isRead = true;
    }
    workItem.isRead = isRead;
  });

  return workItems;
};
