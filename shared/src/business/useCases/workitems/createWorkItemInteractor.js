const { Case } = require('../../entities/Case');
const { Message } = require('../../entities/Message');
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
exports.createWorkItem = async ({
  applicationContext,
  assigneeId,
  caseId,
  documentId,
  message,
}) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized for create workItem');
  }

  const userToAssignTo = await applicationContext
    .getPersistenceGateway()
    .getUserById({
      applicationContext,
      userId: assigneeId,
    });

  const theCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(theCase);

  const document = caseEntity.getDocumentById({
    documentId,
  });

  const newMessage = new Message({
    from: user.name,
    fromUserId: user.userId,
    message,
    to: userToAssignTo.name,
    toUserId: userToAssignTo.userId,
  });

  const newWorkItem = new WorkItem({
    caseId: caseId,
    caseStatus: theCase.status,
    docketNumber: theCase.docketNumber,
    docketNumberSuffix: theCase.docketNumberSuffix,
    document: {
      createdAt: document.createdAt,
      documentId: document.documentId,
      documentType: document.documentType,
    },
    isInitializeCase: false,
  })
    .assignToUser({
      assigneeId,
      assigneeName: userToAssignTo.name,
      role: userToAssignTo.role,
      sentBy: user.name,
      sentByUserId: user.userId,
      sentByUserRole: user.role,
    })
    .addMessage(newMessage);

  document.addWorkItem(newWorkItem);

  await applicationContext.getPersistenceGateway().createWorkItem({
    applicationContext,
    workItem: newWorkItem.validate().toRawObject(),
  });

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return newWorkItem;
};
