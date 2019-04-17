const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/Case');
const { Message } = require('../../entities/Message');
const { UnauthorizedError } = require('../../../errors/errors');
const { WorkItem } = require('../../entities/WorkItem');

/**
 * getWorkItem
 *
 * @param userId
 * @param workItemId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.assignWorkItems = async ({ workItems, applicationContext }) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized to assign work item');
  }

  for (let workItem of workItems) {
    const fullWorkItem = await applicationContext
      .getPersistenceGateway()
      .getWorkItemById({
        applicationContext,
        workItemId: workItem.workItemId,
      });

    const caseObject = await applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId({
        applicationContext,
        caseId: fullWorkItem.caseId,
      });

    const caseToUpdate = new Case(caseObject);

    const workItemEntity = new WorkItem(fullWorkItem);

    await applicationContext.getPersistenceGateway().deleteWorkItemFromInbox({
      applicationContext,
      workItem: fullWorkItem,
    });

    workItemEntity
      .assignToUser({
        assigneeId: workItem.assigneeId,
        assigneeName: workItem.assigneeName,
        role: user.role,
        sentBy: user.name,
        sentByUserId: user.userId,
        sentByUserRole: user.role,
      })
      .addMessage(
        new Message({
          createdAt: new Date().toISOString(),
          from: user.name,
          fromUserId: user.userId,
          message: workItemEntity.getLatestMessageEntity().message,
          to: workItem.assigneeName,
          toUserId: workItem.assigneeId,
        }),
      );

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

    await applicationContext.getPersistenceGateway().saveWorkItemForPaper({
      applicationContext,
      workItem: workItemEntity.validate().toRawObject(),
    });
  }
};
