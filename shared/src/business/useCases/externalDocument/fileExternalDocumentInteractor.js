const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  CASE_STATUS_TYPES,
  DOCUMENT_RELATIONSHIPS,
} = require('../../entities/EntityConstants');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { DOCKET_SECTION } = require('../../entities/EntityConstants');
const { DocketEntry } = require('../../entities/DocketEntry');
const { pick } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');
const { WorkItem } = require('../../entities/WorkItem');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMetadata the metadata for all the documents
 * @returns {object} the updated case after the documents have been added
 */
exports.fileExternalDocumentInteractor = async ({
  applicationContext,
  documentMetadata,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();
  const { docketNumber } = documentMetadata;

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.FILE_EXTERNAL_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  let caseEntity = new Case(caseToUpdate, { applicationContext });
  const workItems = [];

  const {
    secondaryDocument,
    secondarySupportingDocuments,
    supportingDocuments,
    ...primaryDocumentMetadata
  } = documentMetadata;

  const baseMetadata = pick(primaryDocumentMetadata, [
    'partyPrimary',
    'partySecondary',
    'partyIrsPractitioner',
    'practitioner',
    'docketNumber',
  ]);
  const documentsToAdd = [
    [
      documentMetadata.primaryDocumentId,
      { ...primaryDocumentMetadata, secondaryDocument },
      DOCUMENT_RELATIONSHIPS.PRIMARY,
    ],
  ];

  if (secondarySupportingDocuments) {
    secondarySupportingDocuments.forEach(item => {
      item.lodged = true;
    });
  }

  if (supportingDocuments) {
    for (let i = 0; i < supportingDocuments.length; i++) {
      documentsToAdd.push([
        supportingDocuments[i].documentId,
        supportingDocuments[i],
        DOCUMENT_RELATIONSHIPS.PRIMARY_SUPPORTING,
      ]);
    }
  }

  if (secondaryDocument) {
    secondaryDocument.lodged = true;

    documentsToAdd.push([
      secondaryDocument.documentId,
      secondaryDocument,
      DOCUMENT_RELATIONSHIPS.SECONDARY,
    ]);
  }

  if (secondarySupportingDocuments) {
    for (let i = 0; i < secondarySupportingDocuments.length; i++) {
      documentsToAdd.push([
        secondarySupportingDocuments[i].documentId,
        secondarySupportingDocuments[i],
        DOCUMENT_RELATIONSHIPS.SUPPORTING,
      ]);
    }
  }

  const servedParties = aggregatePartiesForService(caseEntity);

  for (let [documentId, metadata, relationship] of documentsToAdd) {
    if (documentId && metadata) {
      const docketEntryEntity = new DocketEntry(
        {
          ...baseMetadata,
          ...metadata,
          documentId,
          documentType: metadata.documentType,
          isOnDocketRecord: true,
          partyPrimary:
            baseMetadata.partyPrimary || documentMetadata.representingPrimary,
          partySecondary:
            baseMetadata.partySecondary ||
            documentMetadata.representingSecondary,
          relationship,
          userId: user.userId,
          ...caseEntity.getCaseContacts({
            contactPrimary: true,
            contactSecondary: true,
          }),
        },
        { applicationContext },
      );

      const highPriorityWorkItem =
        caseEntity.status === CASE_STATUS_TYPES.calendared;

      const workItem = new WorkItem(
        {
          assigneeId: null,
          assigneeName: null,
          associatedJudge: caseToUpdate.associatedJudge,
          caseIsInProgress: caseEntity.inProgress,
          caseStatus: caseToUpdate.status,
          caseTitle: Case.getCaseTitle(Case.getCaseCaption(caseEntity)),
          docketNumber: caseToUpdate.docketNumber,
          docketNumberWithSuffix: caseToUpdate.docketNumberWithSuffix,
          document: {
            ...docketEntryEntity.toRawObject(),
            createdAt: docketEntryEntity.createdAt,
          },
          highPriority: highPriorityWorkItem,
          section: DOCKET_SECTION,
          sentBy: user.name,
          sentByUserId: user.userId,
          trialDate: caseEntity.trialDate,
        },
        { applicationContext },
      );

      docketEntryEntity.setWorkItem(workItem);

      workItems.push(workItem);
      caseEntity.addDocketEntry(docketEntryEntity);

      const isAutoServed = docketEntryEntity.isAutoServed();

      if (isAutoServed) {
        docketEntryEntity.setAsServed(servedParties.all);

        await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
          applicationContext,
          caseEntity,
          documentEntity: docketEntryEntity,
          servedParties,
        });
      }
    }
  }

  caseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAutomaticBlock({
      applicationContext,
      caseEntity,
    });

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  for (let workItem of workItems) {
    await applicationContext.getPersistenceGateway().saveWorkItemForNonPaper({
      applicationContext,
      workItem: workItem.validate().toRawObject(),
    });
  }

  return caseEntity.toRawObject();
};
