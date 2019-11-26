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

  const caseEntity = new Case(caseToUpdate, { applicationContext });
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
    'partyRespondent',
    'practitioner',
    'caseId',
    'docketNumber',
  ]);

  if (secondaryDocument) {
    secondaryDocument.lodged = true;
    secondaryDocument.eventCode = 'MISL';
  }
  if (secondarySupportingDocuments) {
    secondarySupportingDocuments.forEach(item => {
      item.lodged = true;
      item.eventCode = 'MISL';
    });
  }

  const documentsToAdd = [
    [documentIds.shift(), primaryDocumentMetadata, 'primaryDocument'],
  ];

  if (supportingDocuments) {
    for (let i = 0; i < supportingDocuments.length; i++) {
      documentsToAdd.push([
        documentIds.shift(),
        supportingDocuments[i],
        'primarySupportingDocument',
      ]);
    }
  }

  documentsToAdd.push([
    documentIds.shift(),
    secondaryDocument,
    'secondaryDocument',
  ]);

  if (secondarySupportingDocuments) {
    for (let i = 0; i < secondarySupportingDocuments.length; i++) {
      documentsToAdd.push([
        documentIds.shift(),
        secondarySupportingDocuments[i],
        'supportingDocument',
      ]);
    }
  }

  documentsToAdd.forEach(([documentId, metadata, relationship]) => {
    if (documentId && metadata) {
      const documentEntity = new Document(
        {
          ...baseMetadata,
          ...metadata,
          documentId,
          documentType: metadata.documentType,
          relationship,
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

      if (metadata.isPaper) {
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
      }

      workItems.push(workItem);
      caseEntity.addDocumentWithoutDocketRecord(documentEntity);

      const docketRecordEntity = new DocketRecord({
        description: metadata.documentTitle,
        documentId: documentEntity.documentId,
        filingDate: documentEntity.receivedAt,
      });
      caseEntity.addDocketRecord(docketRecordEntity);
    }
  });

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: caseEntity.validate().toRawObject(),
  });

  const workItemsSaved = [];
  for (let workItem of workItems) {
    if (workItem.document.isPaper) {
      workItemsSaved.push(
        applicationContext
          .getPersistenceGateway()
          .saveWorkItemForDocketClerkFilingExternalDocument({
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
