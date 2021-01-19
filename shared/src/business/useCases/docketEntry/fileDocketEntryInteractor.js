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

  const { docketNumber, isFileAttached } = documentMetadata;
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

  const [docketEntryId, metadata, relationship] = [
    primaryDocumentFileId,
    documentMetadata,
    DOCUMENT_RELATIONSHIPS.PRIMARY,
  ];

  if (docketEntryId && metadata) {
    let servedParties;
    const docketRecordEditState =
      metadata.isFileAttached === false ? documentMetadata : {};

    const readyForService = metadata.isFileAttached && !isSavingForLater;
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

    if (metadata.isPaper) {
      workItem.assignToUser({
        assigneeId: user.userId,
        assigneeName: user.name,
        section: user.section,
        sentBy: user.name,
        sentBySection: user.section,
        sentByUserId: user.userId,
      });
    }

    if (readyForService) {
      servedParties = aggregatePartiesForService(caseEntity);
      docketEntryEntity.setAsServed(servedParties.all);
      if (metadata.isPaper) {
        workItem.setAsCompleted({
          message: 'completed',
          user,
        });
      }
    }

    if (isFileAttached) {
      docketEntryEntity.numberOfPages = await applicationContext
        .getUseCaseHelpers()
        .countPagesInDocument({
          applicationContext,
          docketEntryId,
        });
    }

    caseEntity.addDocketEntry(docketEntryEntity);

    if (readyForService) {
      await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
        applicationContext,
        caseEntity,
        docketEntryId: docketEntryEntity.docketEntryId,
        servedParties,
      });
    }

    workItems.push(workItem);
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

  await saveWorkItems({
    applicationContext,
    isSavingForLater,
    workItems,
  });

  return caseEntity.toRawObject();
};

/**
 * Helper function to save any work items required when filing this docket entry
 *
 * @param {object} providers  The providers Object
 * @param {object} providers.applicationContext The application Context
 * @param {boolean} providers.isSavingForLater Whether or not we are saving these work items for later
 * @param {object} providers.workItems An array of work items we are saving
 */
const saveWorkItems = async ({
  applicationContext,
  isSavingForLater,
  workItems,
}) => {
  const workItemsSaved = [];
  for (const workItemObj of workItems) {
    const workItem = workItemObj.validate().toRawObject();
    const { isFileAttached, isPaper } = workItemObj.docketEntry;
    if (isPaper) {
      workItemsSaved.push(
        isFileAttached && !isSavingForLater
          ? applicationContext
              .getPersistenceGateway()
              .saveWorkItemForDocketClerkFilingExternalDocument({
                applicationContext,
                workItem,
              })
          : applicationContext
              .getPersistenceGateway()
              .saveWorkItemForDocketEntryInProgress({
                applicationContext,
                workItem,
              }),
      );
    } else {
      workItemsSaved.push(
        applicationContext.getPersistenceGateway().saveWorkItemForNonPaper({
          applicationContext,
          workItem,
        }),
      );
    }
  }
  await Promise.all(workItemsSaved);
};
