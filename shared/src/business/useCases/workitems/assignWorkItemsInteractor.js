const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/Case');
const { cloneDeep } = require('lodash');
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
exports.assignWorkItems = async ({
  applicationContext,
  assigneeId,
  assigneeName,
  workItemId,
}) => {
  const user = applicationContext.getCurrentUser();
  if (!isAuthorized(user, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized to assign work item');
  }

  const fullWorkItem = await applicationContext
    .getPersistenceGateway()
    .getWorkItemById({
      applicationContext,
      workItemId,
    });

  const caseObject = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId: fullWorkItem.caseId,
    });

  const caseToUpdate = new Case(caseObject);
  const workItemEntity = new WorkItem(fullWorkItem);
  const originalWorkItem = new WorkItem(cloneDeep(fullWorkItem));

  const newMessage = new Message({
    createdAt: new Date().toISOString(),
    from: user.name,
    fromUserId: user.userId,
    message: workItemEntity.getLatestMessageEntity().message,
    to: assigneeName,
    toUserId: assigneeId,
  });

  workItemEntity
    .assignToUser({
      assigneeId,
      assigneeName,
      role: user.role,
      sentBy: user.name,
      sentByUserId: user.userId,
      sentByUserRole: user.role,
    })
    .addMessage(newMessage);

  await Promise.all([
    applicationContext.getPersistenceGateway().deleteWorkItemFromInbox({
      applicationContext,
      deleteFromSection: false,
      workItem: originalWorkItem,
    }),
    applicationContext.getPersistenceGateway().updateWorkItemInCase({
      applicationContext,
      caseToUpdate,
      workItem: workItemEntity.validate().toRawObject(),
    }),
    applicationContext.getPersistenceGateway().saveWorkItemForPaper({
      applicationContext,
      messageId: newMessage.messageId,
      workItem: workItemEntity.validate().toRawObject(),
    }),
  ]);
};
