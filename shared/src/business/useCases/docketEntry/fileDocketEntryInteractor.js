const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  DOCUMENT_RELATIONSHIPS,
  ROLES,
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

  let caseEntity = new Case(caseToUpdate, { applicationContext });
  const workItems = [];

  const baseMetadata = pick(documentMetadata, [
    'partyPrimary',
    'partySecondary',
    'partyIrsPractitioner',
    'practitioner',
  ]);

  const documentsToFile = [
    [primaryDocumentFileId, documentMetadata, DOCUMENT_RELATIONSHIPS.PRIMARY],
  ];

  for (let document of documentsToFile) {
    const [docketEntryId, metadata, relationship] = document;

    if (docketEntryId && metadata) {
      const docketRecordEditState =
        metadata.isFileAttached === false ? documentMetadata : {};

      const docketEntryEntity = new DocketEntry(
        {
          ...baseMetadata,
          ...metadata,
          docketEntryId,
          documentTitle: metadata.documentTitle,
          documentType: metadata.documentType,
          editState: JSON.stringify(docketRecordEditState),
          filingDate: metadata.receivedAt,
          isOnDocketRecord: true,
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
          caseIsInProgress: caseEntity.inProgress,
          caseStatus: caseToUpdate.status,
          caseTitle: Case.getCaseTitle(Case.getCaseCaption(caseEntity)),
          docketEntry: {
            ...docketEntryEntity.toRawObject(),
            createdAt: docketEntryEntity.createdAt,
          },
          docketNumber: caseToUpdate.docketNumber,
          docketNumberWithSuffix: caseToUpdate.docketNumberWithSuffix,
          inProgress: isSavingForLater,
          isRead: user.role !== ROLES.privatePractitioner,
          section: DOCKET_SECTION,
          sentBy: user.name,
          sentByUserId: user.userId,
        },
        { applicationContext },
      );

      docketEntryEntity.setWorkItem(workItem);

      if (metadata.isFileAttached && !isSavingForLater) {
        const servedParties = aggregatePartiesForService(caseEntity);
        docketEntryEntity.setAsServed(servedParties.all);
      } else if (metadata.isFileAttached && isSavingForLater) {
        docketEntryEntity.numberOfPages = await applicationContext
          .getUseCaseHelpers()
          .countPagesInDocument({
            applicationContext,
            docketEntryId,
          });
      }

      if (metadata.isPaper) {
        if (metadata.isFileAttached && !isSavingForLater) {
          workItem.setAsCompleted({
            message: 'completed',
            user,
          });

          const servedParties = aggregatePartiesForService(caseEntity);
          await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
            applicationContext,
            caseEntity,
            docketEntryEntity,
            servedParties,
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
      caseEntity.addDocketEntry(docketEntryEntity);
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
    if (workItem.docketEntry.isPaper) {
      workItemsSaved.push(
        workItem.docketEntry.isFileAttached && !isSavingForLater
          ? applicationContext
              .getPersistenceGateway()
              .saveWorkItemForDocketClerkFilingExternalDocument({
                applicationContext,
                workItem: workItem.validate().toRawObject(),
              })
          : applicationContext
              .getPersistenceGateway()
              .saveWorkItemForDocketEntryInProgress({
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
