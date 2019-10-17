const { omit } = require('lodash');
const {
  FILE_EXTERNAL_DOCUMENT,
  isAuthorized,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const { Case } = require('../../entities/cases/Case');
const { Document } = require('../../entities/Document');
const { DocketRecord } = require('../../entities/DocketRecord');
const { DOCKET_SECTION } = require('../../entities/WorkQueue');

/**
 * completeDocketEntryQCInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.entryMetadata the entry metadata
 * @returns {object} the updated case after the documents are added
 */
exports.completeDocketEntryQCInteractor = async ({
  applicationContext,
  entryMetadata,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, FILE_EXTERNAL_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { caseId, documentId, documentType } = entryMetadata;

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

  const currentDocument = caseEntity.getDocumentById({
    documentId,
  });

  const documentEntity = new Document(
    {
      ...currentDocument,
      ...entryMetadata,
      relationship: 'primaryDocument',
      documentId,
      documentType,
      userId: user.userId,
    },
    { applicationContext },
  ).validate();

  documentEntity.generateFiledBy(caseToUpdate);
  documentEntity.setQCed(user);

  const docketRecordEntry = new DocketRecord({
    description: entryMetadata.documentTitle,
    documentId: documentEntity.documentId,
    editState: '{}',
    filingDate: documentEntity.receivedAt,
  });

  caseEntity.updateDocketRecordEntry(omit(docketRecordEntry, 'index'));
  caseEntity.updateDocument(documentEntity);

  const workItemsToComplete = currentDocument.workItems
    .filter(workItem => workItem.isQC === true)
    .filter(workItem => !workItem.completedAt);

  for (const workItemToComplete of workItemsToComplete) {
    await applicationContext.getPersistenceGateway().deleteWorkItemFromInbox({
      applicationContext,
      workItem: workItemToComplete,
    });

    Object.assign(workItemToComplete, {
      assigneeId: null,
      assigneeName: null,
      caseId: caseId,
      caseStatus: caseToUpdate.status,
      docketNumber: caseToUpdate.docketNumber,
      docketNumberSuffix: caseToUpdate.docketNumberSuffix,
      document: {
        ...documentEntity.toRawObject(),
        createdAt: documentEntity.createdAt,
      },
      section: DOCKET_SECTION,
      sentBy: user.userId,
    });

    workItemToComplete.setAsCompleted({
      message: 'completed',
      user,
    });

    workItemToComplete.assignToUser({
      assigneeId: user.userId,
      assigneeName: user.name,
      section: user.section,
      sentBy: user.name,
      sentBySection: user.section,
      sentByUserId: user.userId,
    });

    await applicationContext
      .getPersistenceGateway()
      .saveWorkItemForDocketClerkFilingExternalDocument({
        applicationContext,
        workItem: workItemToComplete.validate().toRawObject(),
      });
  }

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return caseEntity.toRawObject();
};
