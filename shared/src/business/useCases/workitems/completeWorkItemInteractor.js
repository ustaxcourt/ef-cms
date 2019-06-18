const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/Case');
const { UnauthorizedError } = require('../../../errors/errors');
const { WorkItem } = require('../../entities/WorkItem');

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

  await applicationContext.getPersistenceGateway().putWorkItemInOutbox({
    applicationContext,
    workItem: completedWorkItem,
  });

  await applicationContext.getPersistenceGateway().deleteWorkItemFromInbox({
    applicationContext,
    workItem: completedWorkItem,
  });

  await applicationContext.getPersistenceGateway().updateWorkItem({
    applicationContext,
    workItemToUpdate: completedWorkItem,
  });

  const caseObject = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId: completedWorkItem.caseId,
    });

  const caseToUpdate = new Case(caseObject);

  const workItemEntity = new WorkItem(completedWorkItem);

  caseToUpdate.documents.forEach(
    document =>
      (document.workItems = document.workItems.map(item => {
        return item.workItemId === workItemEntity.workItemId
          ? workItemEntity
          : item;
      })),
  );

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseToUpdate.validate().toRawObject(),
  });

  return completedWorkItem;
};
