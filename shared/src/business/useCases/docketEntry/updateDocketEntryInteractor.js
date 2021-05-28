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
const { DocketEntry } = require('../../entities/DocketEntry');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.documentMetadata the document metadata
 * @param {string} providers.primaryDocumentFileId the id of the primary document file
 * @returns {object} the updated case after the documents are added
 */
exports.updateDocketEntryInteractor = async (
  applicationContext,
  { documentMetadata, isSavingForLater, primaryDocumentFileId },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { docketNumber } = documentMetadata;
  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const currentDocketEntry = caseEntity.getDocketEntryById({
    docketEntryId: primaryDocumentFileId,
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

  const docketEntryEntity = new DocketEntry(
    {
      ...currentDocketEntry,
      filedBy: undefined, // allow constructor to re-generate
      ...editableFields,
      contactPrimary: caseEntity.getContactPrimary(),
      contactSecondary: caseEntity.getContactSecondary(),
      docketEntryId: primaryDocumentFileId,
      documentTitle: editableFields.documentTitle,
      editState: JSON.stringify(editableFields),
      isOnDocketRecord: true,
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
      userId: user.userId,
    },
    { applicationContext },
  );

  if (editableFields.isFileAttached) {
    const { workItem } = docketEntryEntity;

    if (!isSavingForLater) {
      Object.assign(workItem, {
        assigneeId: null,
        assigneeName: null,
        caseIsInProgress: caseEntity.inProgress,
        caseStatus: caseToUpdate.status,
        docketEntry: {
          ...docketEntryEntity.toRawObject(),
          createdAt: docketEntryEntity.createdAt,
        },
        docketNumber: caseToUpdate.docketNumber,
        docketNumberSuffix: caseToUpdate.docketNumberSuffix,
        inProgress: isSavingForLater,
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

      docketEntryEntity.setWorkItem(workItem);

      const servedParties = aggregatePartiesForService(caseEntity);
      docketEntryEntity.setAsServed(servedParties.all);
      docketEntryEntity.setAsProcessingStatusAsCompleted();

      caseEntity.updateDocketEntry(docketEntryEntity);

      await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
        applicationContext,
        caseEntity,
        docketEntryId: docketEntryEntity.docketEntryId,
        servedParties,
      });
    } else {
      docketEntryEntity.numberOfPages = await applicationContext
        .getUseCaseHelpers()
        .countPagesInDocument({
          applicationContext,
          docketEntryId: primaryDocumentFileId,
        });

      Object.assign(workItem, {
        assigneeId: null,
        assigneeName: null,
        caseIsInProgress: caseEntity.inProgress,
        caseStatus: caseToUpdate.status,
        docketEntry: {
          ...docketEntryEntity.toRawObject(),
          createdAt: docketEntryEntity.createdAt,
        },
        docketNumber: caseToUpdate.docketNumber,
        docketNumberSuffix: caseToUpdate.docketNumberSuffix,
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

      await applicationContext.getPersistenceGateway().saveWorkItem({
        applicationContext,
        workItem: workItem.validate().toRawObject(),
      });
    }
    caseEntity.updateDocketEntry(docketEntryEntity);

    await applicationContext
      .getPersistenceGateway()
      .saveWorkItemForDocketClerkFilingExternalDocument({
        applicationContext,
        workItem: workItem.validate().toRawObject(),
      });
  } else if (!editableFields.isFileAttached && isSavingForLater) {
    const { workItem } = docketEntryEntity;

    Object.assign(workItem, {
      assigneeId: null,
      assigneeName: null,
      caseIsInProgress: caseEntity.inProgress,
      caseStatus: caseToUpdate.status,
      docketEntry: {
        ...docketEntryEntity.toRawObject(),
        createdAt: docketEntryEntity.createdAt,
      },
      docketNumber: caseToUpdate.docketNumber,
      docketNumberSuffix: caseToUpdate.docketNumberSuffix,
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

    await applicationContext.getPersistenceGateway().saveWorkItem({
      applicationContext,
      workItem: workItem.validate().toRawObject(),
    });
  }

  caseEntity.updateDocketEntry(docketEntryEntity);

  const result = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  return new Case(result, { applicationContext }).validate().toRawObject();
};
