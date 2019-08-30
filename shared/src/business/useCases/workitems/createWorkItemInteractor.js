const { Case } = require('../../entities/cases/Case');
const { Message } = require('../../entities/Message');
const { WorkItem } = require('../../entities/WorkItem');

const {
  isAuthorized,
  WORKITEM,
} = require('../../../authorization/authorizationClientService');

const { UnauthorizedError } = require('../../../errors/errors');

/**
 * createWorkItemInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.assigneeId the id to assign the work item to
 * @param {string} providers.caseId the id of the case to attach the work item to
 * @param {string} providers.documentId the id of the document to attach the work item to
 * @param {string} providers.message the message for creating the work item
 * @returns {object} the created work item
 */
exports.createWorkItemInteractor = async ({
  applicationContext,
  assigneeId,
  caseId,
  documentId,
  message,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, WORKITEM)) {
    throw new UnauthorizedError('Unauthorized for create workItem');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

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

  const caseEntity = new Case({ applicationContext, rawCase: theCase });

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
      documentTitle: document.documentTitle,
      documentType: document.documentType,
    },
    isInitializeCase: false,
  })
    .assignToUser({
      assigneeId,
      assigneeName: userToAssignTo.name,
      section: userToAssignTo.section,
      sentBy: user.name,
      sentBySection: user.section,
      sentByUserId: user.userId,
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
