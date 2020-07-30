const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { UnauthorizedError } = require('../../../errors/errors');
const { WorkItem } = require('../../entities/WorkItem');

/**
 * createWorkItemInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.assigneeId the id to assign the work item to
 * @param {string} providers.docketNumber the docket number of the case to attach the work item to
 * @param {string} providers.documentId the id of the document to attach the work item to
 * @param {string} providers.message the message for creating the work item
 * @returns {object} the created work item
 */
exports.createWorkItemInteractor = async ({
  applicationContext,
  assigneeId,
  docketNumber,
  documentId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.WORKITEM)) {
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
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(theCase, { applicationContext });

  const document = caseEntity.getDocumentById({
    documentId,
  });

  const newWorkItem = new WorkItem(
    {
      associatedJudge: theCase.associatedJudge,
      caseIsInProgress: theCase.inProgress,
      caseStatus: theCase.status,
      caseTitle: Case.getCaseTitle(Case.getCaseCaption(caseEntity)),
      docketNumber: theCase.docketNumber,
      docketNumberWithSuffix: theCase.docketNumberWithSuffix,
      document: {
        createdAt: document.createdAt,
        documentId: document.documentId,
        documentTitle: document.documentTitle,
        documentType: document.documentType,
      },
      isInitializeCase: false,
      isQC: false,
    },
    { applicationContext },
  ).assignToUser({
    assigneeId,
    assigneeName: userToAssignTo.name,
    section: userToAssignTo.section,
    sentBy: user.name,
    sentBySection: user.section,
    sentByUserId: user.userId,
  });

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
