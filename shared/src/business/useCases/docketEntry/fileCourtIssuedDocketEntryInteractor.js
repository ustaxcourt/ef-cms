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

  const document = caseEntity.documents.find(
    document => document.documentId === documentId,
  );

  if (!document) {
    throw new NotFoundError('Document not found.');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const documentEntity = new Document(
    {
      ...document,
      userId: user.userId,
      attachments: documentMeta.attachments,
      documentTitle: documentMeta.generatedDocumentTitle,
      eventCode: documentMeta.eventCode,
      freeText: documentMeta.freeText,
      scenario: documentMeta.scenario,
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
  caseEntity.updateDocument(documentEntity);

  caseEntity.addDocketRecord(
    new DocketRecord({
      description: documentMeta.documentTitle,
      documentId: documentEntity.documentId,
      editState: '{}',
      filingDate: documentEntity.date || createISODateString(),
    }),
  );

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return caseEntity.toRawObject();
};
