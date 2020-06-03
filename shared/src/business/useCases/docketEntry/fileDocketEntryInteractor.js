const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { capitalize, pick } = require('lodash');
const { Case } = require('../../entities/cases/Case');
const { DOCKET_SECTION } = require('../../entities/WorkQueue');
const { DocketRecord } = require('../../entities/DocketRecord');
const { Document } = require('../../entities/Document');
const { Message } = require('../../entities/Message');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');
const { WorkItem } = require('../../entities/WorkItem');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMetadata the document metadata
 * @param {string} providers.primaryDocumentFileId the id of the primary document file
 * @param {string} providers.secondaryDocumentFileId the id of the secondary document file (optional)
 * @param {string} providers.secondarySupportingDocumentFileId the id of the secondary supporting document file (optional)
 * @param {string} providers.supportingDocumentFileId the id of the supporting document file (optional)
 * @returns {object} the updated case after the documents are added
 */
exports.fileDocketEntryInteractor = async ({
  applicationContext,
  documentMetadata,
  primaryDocumentFileId,
  secondaryDocumentFileId,
  secondarySupportingDocumentFileId,
  supportingDocumentFileId,
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

  let caseEntity = new Case(caseToUpdate, { applicationContext });
  const workItems = [];

  const {
    secondaryDocument,
    secondarySupportingDocumentMetadata,
    supportingDocumentMetadata,
    ...primaryDocumentMetadata
  } = documentMetadata;

  const baseMetadata = pick(primaryDocumentMetadata, [
    'partyPrimary',
    'partySecondary',
    'partyIrsPractitioner',
    'practitioner',
  ]);

  if (primaryDocumentMetadata.lodged) {
    primaryDocumentMetadata.eventCode = 'MISL';
  }

  if (secondaryDocument) {
    secondaryDocument.lodged = true;
    secondaryDocument.eventCode = 'MISL';
  }

  if (secondarySupportingDocumentMetadata) {
    secondarySupportingDocumentMetadata.lodged = true;
    secondarySupportingDocumentMetadata.eventCode = 'MISL';
  }

  [
    [primaryDocumentFileId, primaryDocumentMetadata, 'primaryDocument'],
    [
      supportingDocumentFileId,
      supportingDocumentMetadata,
      'primarySupportingDocument',
    ],
    [secondaryDocumentFileId, secondaryDocument, 'secondaryDocument'],
    [
      secondarySupportingDocumentFileId,
      secondarySupportingDocumentMetadata,
      'secondarySupportingDocument',
    ],
  ].forEach(([documentId, metadata, relationship]) => {
    if (documentId && metadata) {
      const documentEntity = new Document(
        {
          ...baseMetadata,
          ...metadata,
          documentId,
          documentType: metadata.documentType,
          mailingDate: metadata.mailingDate,
          relationship,
          userId: user.userId,
          ...caseEntity.getCaseContacts({
            contactPrimary: true,
            contactSecondary: true,
          }),
        },
        { applicationContext },
      );

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
          isQC: true,
          isRead: user.role !== User.ROLES.privatePractitioner,
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

      if (metadata.isPaper) {
        if (metadata.isFileAttached) {
          workItem.setAsCompleted({
            message: 'completed',
            user,
          });
        }

        workItem.assignToUser({
          assigneeId: user.userId,
          assigneeName: user.name,
          section: user.section,
          sentBy: user.name,
          sentBySection: user.section,
          sentByUserId: user.userId,
        });
      }

      workItems.push(workItem);
      caseEntity.addDocumentWithoutDocketRecord(documentEntity);

      const docketRecordEditState =
        documentEntity.isFileAttached === false ? documentMetadata : {};

      caseEntity.addDocketRecord(
        new DocketRecord(
          {
            description: metadata.documentTitle,
            documentId: documentEntity.documentId,
            editState: JSON.stringify(docketRecordEditState),
            eventCode: documentEntity.eventCode,
            filingDate: documentEntity.receivedAt,
          },
          { applicationContext },
        ),
      );
    }
  });

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

  const workItemsSaved = [];
  for (let workItem of workItems) {
    if (workItem.document.isPaper) {
      workItemsSaved.push(
        workItem.document.isFileAttached
          ? applicationContext
              .getPersistenceGateway()
              .saveWorkItemForDocketClerkFilingExternalDocument({
                applicationContext,
                workItem: workItem.validate().toRawObject(),
              })
          : applicationContext
              .getPersistenceGateway()
              .saveWorkItemForDocketEntryWithoutFile({
                applicationContext,
                workItem: workItem.validate().toRawObject(),
              }),
      );
    } else {
      workItemsSaved.push(
        applicationContext.getPersistenceGateway().saveWorkItemForNonPaper({
          applicationContext,
          workItem: workItem.validate().toRawObject(),
        }),
      );
    }
  }
  await Promise.all(workItemsSaved);

  return caseEntity.toRawObject();
};
