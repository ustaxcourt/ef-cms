const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
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
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');
const { WorkItem } = require('../../entities/WorkItem');

/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.documentMetadata the document metadata
 * @param {boolean} providers.isSavingForLater flag for saving docket entry for later instead of serving it
 * @param {string} providers.primaryDocumentFileId the id of the document file
 * @returns {object} the updated case after the documents are added
 */
exports.fileDocketEntryInteractor = async ({
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

  let caseEntity = new Case(caseToUpdate, { applicationContext });
  const workItems = [];

  const baseMetadata = pick(documentMetadata, [
    'partyPrimary',
    'partySecondary',
    'partyIrsPractitioner',
    'practitioner',
  ]);

  const documentsToFile = [
    [primaryDocumentFileId, documentMetadata, 'primaryDocument'],
  ];

  for (let document of documentsToFile) {
    const [documentId, metadata, relationship] = document;

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
          isRead: user.role !== ROLES.privatePractitioner,
          section: DOCKET_SECTION,
          sentBy: user.name,
          sentByUserId: user.userId,
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

      if (metadata.isFileAttached && !isSavingForLater) {
        const servedParties = aggregatePartiesForService(caseEntity);
        documentEntity.setAsServed(servedParties.all);
      } else if (isSavingForLater) {
        documentEntity.numberOfPages = await applicationContext
          .getUseCaseHelpers()
          .countPagesInDocument({
            applicationContext,
            documentId,
          });
      }

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
