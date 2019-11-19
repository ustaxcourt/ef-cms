const {
  generateNoticeOfDocketChangePdf,
} = require('../../useCaseHelper/noticeOfDocketChange/generateNoticeOfDocketChangePdf');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { DOCKET_SECTION } = require('../../entities/WorkQueue');
const { DocketRecord } = require('../../entities/DocketRecord');
const { Document } = require('../../entities/Document');
const { omit } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');

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

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY)) {
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

  const needsNewCoversheet =
    entryMetadata.additionalInfo != currentDocument.additionalInfo ||
    entryMetadata.documentTitle != currentDocument.documentTitle;

  const needsNoticeOfDocketChange =
    entryMetadata.filedBy != currentDocument.filedBy ||
    entryMetadata.documentTitle != currentDocument.documentTitle;

  const docketChangeInfo = {
    caseTitle: caseToUpdate.caseTitle,
    docketEntryIndex: entryMetadata.index,
    docketNumber: `${
      caseToUpdate.docketNumber
    }${caseToUpdate.docketNumberSuffix || ''}`,
    filingParties: {
      after: entryMetadata.filedBy,
      before: currentDocument.filedBy,
    },
    filingsAndProceedings: {
      after: entryMetadata.documentTitle,
      before: currentDocument.documentTitle,
    },
  };

  const documentEntity = new Document(
    {
      workItems: currentDocument.workItems,
      ...entryMetadata,
      documentId,
      documentType,
      relationship: 'primaryDocument',
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

  const workItemsToUpdate = currentDocument.workItems.filter(
    workItem => workItem.isQC === true,
  );

  for (const workItemToUpdate of workItemsToUpdate) {
    await applicationContext.getPersistenceGateway().deleteWorkItemFromInbox({
      applicationContext,
      workItem: workItemToUpdate,
    });

    Object.assign(workItemToUpdate, {
      caseId: caseId,
      caseStatus: caseToUpdate.status,
      docketNumber: caseToUpdate.docketNumber,
      docketNumberSuffix: caseToUpdate.docketNumberSuffix,
      document: {
        ...documentEntity.toRawObject(),
        createdAt: documentEntity.createdAt,
      },
    });

    if (!workItemToUpdate.completedAt) {
      Object.assign(workItemToUpdate, {
        assigneeId: null,
        assigneeName: null,
        section: DOCKET_SECTION,
        sentBy: user.userId,
      });

      workItemToUpdate.setAsCompleted({
        message: 'completed',
        user,
      });

      workItemToUpdate.assignToUser({
        assigneeId: user.userId,
        assigneeName: user.name,
        section: user.section,
        sentBy: user.name,
        sentBySection: user.section,
        sentByUserId: user.userId,
      });
    }

    await applicationContext
      .getPersistenceGateway()
      .saveWorkItemForDocketClerkFilingExternalDocument({
        applicationContext,
        workItem: workItemToUpdate.validate().toRawObject(),
      });
  }

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  if (needsNoticeOfDocketChange) {
    generateNoticeOfDocketChangePdf({
      applicationContext,
      docketChangeInfo,
    });
  }

  if (needsNewCoversheet) {
    await applicationContext.getUseCases().addCoversheetInteractor({
      applicationContext,
      caseId,
      documentId,
    });
  }

  return caseEntity.toRawObject();
};
