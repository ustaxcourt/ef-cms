const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { Message } = require('../../entities/Message');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');
const { WorkItem } = require('../../entities/WorkItem');

/**
 *
 * @param workItemId
 * @param assigneeId
 * @param message
 * @param applicationContext
 * @returns {Promise<Promise<*>|*|Promise<*>|Promise<*>|Promise<*>|Promise<null>>}
 */
exports.forwardWorkItem = async ({
  applicationContext,
  assigneeId,
  message,
  workItemId,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized for assign work item');
  }

  const userToForwardTo = new User(
    await applicationContext
      .getPersistenceGateway()
      .getUserById({ applicationContext, userId: assigneeId }),
  );

  const fullWorkItem = await applicationContext
    .getPersistenceGateway()
    .getWorkItemById({
      applicationContext,
      workItemId: workItemId,
    });

  const newMessage = new Message({
    createdAt: new Date().toISOString(),
    from: user.name,
    fromUserId: user.userId,
    message,
    to: userToForwardTo.name,
    toUserId: userToForwardTo.userId,
  });

  const workItemToForward = new WorkItem(fullWorkItem)
    .setAsInternal()
    .assignToUser({
      assigneeId: userToForwardTo.userId,
      assigneeName: userToForwardTo.name,
      role: userToForwardTo.role,
      sentBy: user.name,
      sentByUserId: user.userId,
      sentByUserRole: user.role,
    })
    .addMessage(newMessage);

  const caseObject = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId: workItemToForward.caseId,
    });

  const caseToUpdate = new Case(caseObject);

  await applicationContext.getPersistenceGateway().deleteWorkItemFromInbox({
    applicationContext,
    workItem: fullWorkItem,
  });

  caseToUpdate.documents.forEach(
    document =>
      (document.workItems = document.workItems.map(item => {
        return item.workItemId === workItemToForward.workItemId
          ? workItemToForward
          : item;
      })),
  );

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseToUpdate.validate().toRawObject(),
  });

  await applicationContext.getPersistenceGateway().saveWorkItemForPaper({
    applicationContext,
    messageId: newMessage.messageId,
    workItem: workItemToForward.validate().toRawObject(),
  });

  await applicationContext.getPersistenceGateway().putWorkItemInOutbox({
    applicationContext,
    workItem: {
      ...workItemToForward.validate().toRawObject(),
      createdAt: new Date().toISOString(),
    },
  });

  return workItemToForward.toRawObject();
};
