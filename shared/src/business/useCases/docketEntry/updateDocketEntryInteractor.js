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
    isFileAttached: documentMetadata.isFileAttached,
    lodged: documentMetadata.lodged,
    mailingDate: documentMetadata.mailingDate,
    objections: documentMetadata.objections,
    ordinalValue: documentMetadata.ordinalValue,
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
      ...editableFields,
      documentId: primaryDocumentFileId,
      relationship: 'primaryDocument',
      userId: user.userId,
      ...caseEntity.getCaseContacts({
        contactPrimary: true,
        contactSecondary: true,
      }),
    },
    { applicationContext },
  );
  documentEntity.generateFiledBy(caseToUpdate, true);

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
  caseEntity.updateDocument(documentEntity);

  if (editableFields.isFileAttached) {
    const workItemToDelete = currentDocument.workItems.find(
      workItem => !workItem.document.isFileAttached,
    );

    await applicationContext.getPersistenceGateway().deleteWorkItemFromInbox({
      applicationContext,
      workItem: workItemToDelete,
    });

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

    await applicationContext
      .getPersistenceGateway()
      .saveWorkItemForDocketClerkFilingExternalDocument({
        applicationContext,
        workItem: workItem.validate().toRawObject(),
      });
  }

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  return caseEntity.toRawObject();
};
