const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { capitalize } = require('lodash');
const { Case } = require('../../entities/cases/Case');
const { DOCKET_SECTION } = require('../../entities/WorkQueue');
const { Document } = require('../../entities/Document');
const { Message } = require('../../entities/Message');
const { UnauthorizedError } = require('../../../errors/errors');
const { WorkItem } = require('../../entities/WorkItem');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.document the document being added to the docket record
 * @returns {object} the updated case after the documents are added
 */
exports.fileCourtIssuedDocketEntryInteractor = async ({
  applicationContext,
  document,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { caseId } = document;
  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const documentEntity = new Document(
    {
      ...document,
      userId: user.userId,
    },
    { applicationContext },
  );

  documentEntity.generateFiledBy(caseToUpdate);

  const workItem = new WorkItem(
    {
      assigneeId: null,
      assigneeName: null,
      caseId: caseId,
      caseStatus: caseToUpdate.status,
      caseTitle: Case.getCaseCaptionNames(Case.getCaseCaption(caseEntity)),
      docketNumber: caseToUpdate.docketNumber,
      docketNumberSuffix: caseToUpdate.docketNumberSuffix,
      document: {
        ...documentEntity.toRawObject(),
        createdAt: documentEntity.createdAt,
      },
      isQC: true,
      section: DOCKET_SECTION,
      sentBy: user.userId,
    },
    { applicationContext },
  );

  const message = new Message(
    {
      from: user.name,
      fromUserId: user.userId,
      message: `${documentEntity.documentType} filed by ${capitalize(
        user.role,
      )} is ready for review.`,
    },
    { applicationContext },
  );

  workItem.addMessage(message);
  documentEntity.addWorkItem(workItem);
  caseEntity.addDocument(documentEntity);

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return caseEntity.toRawObject();
};
