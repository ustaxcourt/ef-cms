const { WorkItem } = require('../../entities/WorkItem');
const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * completeWorkItem
 *
 * @param workItemId
 * @param message
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.completeWorkItem = async ({
  completedMessage,
  workItemId,
  applicationContext,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized for complete workItem');
  }
  const originalWorkItem = await applicationContext
    .getPersistenceGateway()
    .getWorkItemById({
      applicationContext,
      workItemId,
    });

  const completedWorkItem = new WorkItem(originalWorkItem)
    .setAsCompleted({
      message: completedMessage,
      user: applicationContext.getCurrentUser(),
    })
    .validate()
    .toRawObject();

  await applicationContext.getPersistenceGateway().saveWorkItem({
    applicationContext,
    createOutboxEntries: true,
    workItemToSave: completedWorkItem,
  });

  return completedWorkItem;
};
