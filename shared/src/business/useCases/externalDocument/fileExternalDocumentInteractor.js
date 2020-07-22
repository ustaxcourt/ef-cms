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
const { capitalize, pick } = require('lodash');
const { Case } = require('../../entities/cases/Case');
const { DOCKET_SECTION } = require('../../entities/EntityConstants');
const { DocketRecord } = require('../../entities/DocketRecord');
const { Document } = require('../../entities/Document');
const { Message } = require('../../entities/Message');
const { UnauthorizedError } = require('../../../errors/errors');
const { WorkItem } = require('../../entities/WorkItem');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Array<string>} providers.documentIds the document ids for the primary, supporting,
 * secondary, and secondary supporting documents
 * @param {object} providers.documentMetadata the metadata for all the documents
 * @returns {object} the updated case after the documents have been added
 */
exports.fileExternalDocumentInteractor = async ({
  applicationContext,
  documentIds,
  documentMetadata,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();
  const { caseId } = documentMetadata;

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.FILE_EXTERNAL_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByCaseId({
      applicationContext,
      caseId,
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
    'caseId',
    'docketNumber',
  ]);

  if (secondaryDocument) {
    secondaryDocument.lodged = true;
  }
  if (secondarySupportingDocuments) {
    secondarySupportingDocuments.forEach(item => {
      item.lodged = true;
    });
  }

  const documentsToAdd = [
    [
      documentIds.shift(),
      { ...primaryDocumentMetadata, secondaryDocument },
      DOCUMENT_RELATIONSHIPS.PRIMARY,
    ],
  ];

  if (supportingDocuments) {
    for (let i = 0; i < supportingDocuments.length; i++) {
      documentsToAdd.push([
        documentIds.shift(),
        supportingDocuments[i],
        DOCUMENT_RELATIONSHIPS.PRIMARY_SUPPORTING,
      ]);
    }
  }

  documentsToAdd.push([
    documentIds.shift(),
    secondaryDocument,
    DOCUMENT_RELATIONSHIPS.SECONDARY,
  ]);

  if (secondarySupportingDocuments) {
    for (let i = 0; i < secondarySupportingDocuments.length; i++) {
      documentsToAdd.push([
        documentIds.shift(),
        secondarySupportingDocuments[i],
        DOCUMENT_RELATIONSHIPS.SUPPORTING,
      ]);
    }
  }

  const servedParties = aggregatePartiesForService(caseEntity);

  for (let [documentId, metadata, relationship] of documentsToAdd) {
    if (documentId && metadata) {
      const documentEntity = new Document(
        {
          ...baseMetadata,
          ...metadata,
          documentId,
          documentType: metadata.documentType,
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
          caseId: caseId,
          caseIsInProgress: caseEntity.inProgress,
          caseStatus: caseToUpdate.status,
          caseTitle: Case.getCaseTitle(Case.getCaseCaption(caseEntity)),
          docketNumber: caseToUpdate.docketNumber,
          docketNumberWithSuffix: caseToUpdate.docketNumberWithSuffix,
          document: {
            ...documentEntity.toRawObject(),
            createdAt: documentEntity.createdAt,
          },
          highPriority: highPriorityWorkItem,
          isQC: true,
          section: DOCKET_SECTION,
          sentBy: user.name,
          sentByUserId: user.userId,
          trialDate: caseEntity.trialDate,
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

      workItems.push(workItem);
      caseEntity.addDocumentWithoutDocketRecord(documentEntity);

      const docketRecordEntity = new DocketRecord(
        {
          description: metadata.documentTitle,
          documentId: documentEntity.documentId,
          eventCode: documentEntity.eventCode,
          filingDate: documentEntity.receivedAt,
        },
        { applicationContext },
      );
      caseEntity.addDocketRecord(docketRecordEntity);

      if (documentEntity.isAutoServed()) {
        documentEntity.setAsServed(servedParties.all);

        await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
          applicationContext,
          caseEntity,
          documentEntity,
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
