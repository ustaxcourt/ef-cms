const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { capitalize } = require('lodash');
const { Case } = require('../../entities/cases/Case');
const { createISODateString } = require('../../utilities/DateHandler');
const { DOCKET_SECTION } = require('../../entities/WorkQueue');
const { DocketRecord } = require('../../entities/DocketRecord');
const { Document } = require('../../entities/Document');
const { Message } = require('../../entities/Message');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');
const { WorkItem } = require('../../entities/WorkItem');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMeta document details to go on the record
 * @returns {object} the updated case after the documents are added
 */
exports.fileCourtIssuedDocketEntryInteractor = async ({
  applicationContext,
  documentMeta,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { caseId, documentId } = documentMeta;

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const document = caseEntity.getDocumentById({
    documentId,
  });

  if (!document) {
    throw new NotFoundError('Document not found');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const documentEntity = new Document(
    {
      ...document,
      attachments: documentMeta.attachments,
      documentTitle: documentMeta.generatedDocumentTitle,
      documentType: documentMeta.documentType,
      eventCode: documentMeta.eventCode,
      freeText: documentMeta.freeText,
      isFileAttached: true,
      scenario: documentMeta.scenario,
      serviceStamp: documentMeta.serviceStamp,
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
      inProgress: true,
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
  caseEntity.updateDocument(documentEntity);

  workItem.assignToUser({
    assigneeId: user.userId,
    assigneeName: user.name,
    section: user.section,
    sentBy: user.name,
    sentBySection: user.section,
    sentByUserId: user.userId,
  });

  caseEntity.addDocketRecord(
    new DocketRecord({
      description: documentMeta.generatedDocumentTitle,
      documentId: documentEntity.documentId,
      editState: JSON.stringify(documentMeta),
      filingDate: documentEntity.date || createISODateString(),
    }),
  );

  const saveItems = [
    applicationContext.getPersistenceGateway().createUserInboxRecord({
      applicationContext,
      workItem: workItem.validate().toRawObject(),
    }),
    applicationContext.getPersistenceGateway().createSectionInboxRecord({
      applicationContext,
      workItem: workItem.validate().toRawObject(),
    }),
    applicationContext.getPersistenceGateway().updateCase({
      applicationContext,
      caseToUpdate: caseEntity.validate().toRawObject(),
    }),
  ];

  await Promise.all(saveItems);

  return caseEntity.toRawObject();
};
