const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { cloneDeep } = require('lodash');
const { Message } = require('../../entities/Message');
const { UnauthorizedError } = require('../../../errors/errors');
const { WorkItem } = require('../../entities/WorkItem');

/**
 * getWorkItem
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.assigneeId the id of the user to assign the work item to
 * @param {string} providers.assigneeName the name of the user to assign the work item to
 * @param {string} providers.workItemId the id of the work item to assign
 */
exports.assignWorkItemsInteractor = async ({
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
      section: user.section,
      sentBy: user.name,
      sentBySection: user.section,
      sentByUserId: user.userId,
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
