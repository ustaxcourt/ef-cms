const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  DOCKET_SECTION,
  DOCUMENT_RELATIONSHIPS,
} = require('../../entities/EntityConstants');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { DocketRecord } = require('../../entities/DocketRecord');
const { Document } = require('../../entities/Document');
const { omit } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMetadata the document metadata
 * @param {string} providers.primaryDocumentFileId the id of the primary document file
 * @returns {object} the updated case after the documents are added
 */
exports.updateDocketEntryInteractor = async ({
  applicationContext,
  documentMetadata,
  isSavingForLater,
  primaryDocumentFileId,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { caseId } = documentMetadata;
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
    documentId: primaryDocumentFileId,
  });

  const editableFields = {
    addToCoversheet: documentMetadata.addToCoversheet,
    additionalInfo: documentMetadata.additionalInfo,
    additionalInfo2: documentMetadata.additionalInfo2,
    attachments: documentMetadata.attachments,
    certificateOfService: documentMetadata.certificateOfService,
    certificateOfServiceDate: documentMetadata.certificateOfServiceDate,
    documentTitle: documentMetadata.documentTitle,
    documentType: documentMetadata.documentType,
    eventCode: documentMetadata.eventCode,
    freeText: documentMetadata.freeText,
    freeText2: documentMetadata.freeText2,
    hasOtherFilingParty: documentMetadata.hasOtherFilingParty,
    isFileAttached: documentMetadata.isFileAttached,
    lodged: documentMetadata.lodged,
    mailingDate: documentMetadata.mailingDate,
    objections: documentMetadata.objections,
    ordinalValue: documentMetadata.ordinalValue,
    otherFilingParty: documentMetadata.otherFilingParty,
    partyIrsPractitioner: documentMetadata.partyIrsPractitioner,
    partyPrimary: documentMetadata.partyPrimary,
    partySecondary: documentMetadata.partySecondary,
    pending: documentMetadata.pending,
    receivedAt: documentMetadata.receivedAt,
    scenario: documentMetadata.scenario,
    serviceDate: documentMetadata.serviceDate,
  };

  const documentEntity = new Document(
    {
      ...currentDocument,
      filedBy: undefined, // allow constructor to re-generate
      ...editableFields,
      documentId: primaryDocumentFileId,
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
      userId: user.userId,
      ...caseEntity.getCaseContacts({
        contactPrimary: true,
        contactSecondary: true,
      }),
    },
    { applicationContext },
  );

  const existingDocketRecordEntry = caseEntity.getDocketRecordByDocumentId(
    documentEntity.documentId,
  );

  const docketRecordEntry = new DocketRecord(
    {
      ...existingDocketRecordEntry,
      description: editableFields.documentTitle,
      documentId: documentEntity.documentId,
      editState: JSON.stringify(editableFields),
      eventCode: documentEntity.eventCode,
      filingDate: documentEntity.receivedAt,
    },
    { applicationContext },
  );

  caseEntity.updateDocketRecordEntry(omit(docketRecordEntry, 'index'));

  if (editableFields.isFileAttached) {
    const workItem = documentEntity.getQCWorkItem();

    if (!isSavingForLater) {
      const workItemToDelete = currentDocument.workItems.find(
        workItem => !workItem.document.isFileAttached,
      );

      if (workItemToDelete) {
        await applicationContext
          .getPersistenceGateway()
          .deleteWorkItemFromInbox({
            applicationContext,
            workItem: workItemToDelete,
          });
      }

      Object.assign(workItem, {
        assigneeId: null,
        assigneeName: null,
        caseId: caseId,
        caseIsInProgress: caseEntity.inProgress,
        caseStatus: caseToUpdate.status,
        docketNumber: caseToUpdate.docketNumber,
        docketNumberSuffix: caseToUpdate.docketNumberSuffix,
        document: {
          ...documentEntity.toRawObject(),
          createdAt: documentEntity.createdAt,
        },
        inProgress: isSavingForLater,
        isQC: true,
        section: DOCKET_SECTION,
        sentBy: user.userId,
      });

      workItem.setAsCompleted({
        message: 'completed',
        user,
      });

      workItem.assignToUser({
        assigneeId: user.userId,
        assigneeName: user.name,
        section: user.section,
        sentBy: user.name,
        sentBySection: user.section,
        sentByUserId: user.userId,
      });

      documentEntity.addWorkItem(workItem);

      const servedParties = aggregatePartiesForService(caseEntity);
      documentEntity.setAsServed(servedParties.all);
      documentEntity.setAsProcessingStatusAsCompleted();

      await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
        applicationContext,
        caseEntity,
        documentEntity,
        servedParties,
      });
    } else {
      documentEntity.numberOfPages = await applicationContext
        .getUseCaseHelpers()
        .countPagesInDocument({
          applicationContext,
          documentId: primaryDocumentFileId,
        });
    }
    caseEntity.updateDocument(documentEntity);

    await applicationContext
      .getPersistenceGateway()
      .saveWorkItemForDocketClerkFilingExternalDocument({
        applicationContext,
        workItem: workItem.validate().toRawObject(),
      });
  } else if (!editableFields.isFileAttached && isSavingForLater) {
    const workItem = documentEntity.getQCWorkItem();

    Object.assign(workItem, {
      assigneeId: null,
      assigneeName: null,
      caseId: caseId,
      caseIsInProgress: caseEntity.inProgress,
      caseStatus: caseToUpdate.status,
      docketNumber: caseToUpdate.docketNumber,
      docketNumberSuffix: caseToUpdate.docketNumberSuffix,
      document: {
        ...documentEntity.toRawObject(),
        createdAt: documentEntity.createdAt,
      },
      inProgress: isSavingForLater,
      section: DOCKET_SECTION,
      sentBy: user.userId,
    });

    workItem.assignToUser({
      assigneeId: user.userId,
      assigneeName: user.name,
      section: user.section,
      sentBy: user.name,
      sentBySection: user.section,
      sentByUserId: user.userId,
    });

    await applicationContext
      .getPersistenceGateway()
      .saveWorkItemForDocketEntryInProgress({
        applicationContext,
        workItem: workItem.validate().toRawObject(),
      });
  }

  caseEntity.updateDocument(documentEntity);

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return caseEntity.toRawObject();
};
