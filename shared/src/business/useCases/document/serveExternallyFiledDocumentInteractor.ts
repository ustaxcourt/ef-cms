const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  ALLOWLIST_FEATURE_FLAGS,
  DOCKET_SECTION,
} = require('../../entities/EntityConstants');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { addCoverToPdf } = require('../addCoverToPdf');
const { Case } = require('../../entities/cases/Case');
const { createISODateString } = require('../../utilities/DateHandler');
const { DocketEntry } = require('../../entities/DocketEntry');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');
const { omit } = require('lodash');
const { WorkItem } = require('../../entities/WorkItem');

/**
 * serveExternallyFiledDocumentInteractor
 *
 * @param {Object} applicationContext the application context
 * @param {Object} providers the providers object
 * @param {object} providers.clientConnectionId the client connection Id
 * @param {String} providers.docketEntryId the ID of the docket entry being filed and served
 * @param {String[]} providers.docketNumbers the docket numbers that this docket entry needs to be filed and served on, will be one or more docket numbers
 * @param {String} providers.subjectCaseDocketNumber the docket number that initiated the filing and service
 */
export const serveExternallyFiledDocumentInteractor = async (
  applicationContext: IApplicationContext,
  {
    clientConnectionId,
    docketEntryId,
    docketNumbers,
    subjectCaseDocketNumber,
  }: {
    clientConnectionId: string;
    docketEntryId: string;
    docketNumbers: string[];
    subjectCaseDocketNumber: string;
  },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  const hasPermission =
    (isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY) ||
      isAuthorized(
        authorizedUser,
        ROLE_PERMISSIONS.CREATE_ORDER_DOCKET_ENTRY,
      )) &&
    isAuthorized(authorizedUser, ROLE_PERMISSIONS.SERVE_DOCUMENT);

  if (!hasPermission) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const subjectCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: subjectCaseDocketNumber,
    });

  let subjectCaseEntity = new Case(subjectCase, { applicationContext });

  const originalSubjectDocketEntry = subjectCaseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!originalSubjectDocketEntry) {
    throw new NotFoundError('Docket entry not found');
  }
  if (originalSubjectDocketEntry.servedAt) {
    throw new Error('Docket entry has already been served');
  }
  if (originalSubjectDocketEntry.isPendingService) {
    throw new Error('Docket entry is already being served');
  }

  const consolidateCaseDuplicateDocketEntries = await applicationContext
    .getUseCases()
    .getFeatureFlagValueInteractor(applicationContext, {
      featureFlag: ALLOWLIST_FEATURE_FLAGS.MULTI_DOCKETABLE_PAPER_FILINGS.key,
    });

  if (!consolidateCaseDuplicateDocketEntries) {
    docketNumbers = [subjectCaseDocketNumber];
  }

  const { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: originalSubjectDocketEntry.docketEntryId,
    })
    .promise();

  const numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({
      applicationContext,
      docketEntryId,
      documentBytes: pdfData,
    });

  await applicationContext
    .getPersistenceGateway()
    .updateDocketEntryPendingServiceStatus({
      applicationContext,
      docketEntryId: originalSubjectDocketEntry.docketEntryId,
      docketNumber: subjectCaseDocketNumber,
      status: true,
    });

  let caseEntities = [];
  let paperServicePdfUrl;
  let pdfWithCoversheet;

  try {
    let consolidatedGroupHasPaperServiceCase: boolean;

    for (const docketNumber of docketNumbers) {
      const rawCaseToUpdate = await applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber({
          applicationContext,
          docketNumber,
        });

      let caseEntityToUpdate = new Case(rawCaseToUpdate, {
        applicationContext,
      });

      try {
        const coversheetLength = 1;

        ({ consolidatedGroupHasPaperServiceCase, newCase: caseEntityToUpdate } =
          await fileDocumentOnOneCase({
            applicationContext,
            caseEntity: caseEntityToUpdate,
            consolidatedGroupHasPaperServiceCase,
            numberOfPages: numberOfPages + coversheetLength,
            originalSubjectDocketEntry,
            user,
          }));
      } catch (e) {
        continue;
      }
      caseEntities.push(caseEntityToUpdate);
    }

    const updatedSubjectCaseEntity = caseEntities.find(
      c => c.docketNumber === subjectCaseDocketNumber,
    );
    const updatedSubjectDocketEntry =
      updatedSubjectCaseEntity.getDocketEntryById({ docketEntryId });

    ({ pdfData: pdfWithCoversheet } = await addCoverToPdf({
      applicationContext,
      caseEntity: updatedSubjectCaseEntity,
      docketEntryEntity: updatedSubjectDocketEntry,
      pdfData,
    }));

    let paperServiceResult = await applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf({
        applicationContext,
        caseEntities,
        docketEntryId: originalSubjectDocketEntry.docketEntryId,
      });

    if (consolidatedGroupHasPaperServiceCase) {
      paperServicePdfUrl = paperServiceResult && paperServiceResult.pdfUrl;
    }
  } finally {
    for (const caseEntity of caseEntities) {
      try {
        await applicationContext
          .getPersistenceGateway()
          .updateDocketEntryPendingServiceStatus({
            applicationContext,
            docketEntryId: originalSubjectDocketEntry.docketEntryId,
            docketNumber: caseEntity.docketNumber,
            status: false,
          });
      } catch (e) {
        applicationContext.logger.error(
          `Encountered an exception trying to reset isPendingService on Docket Number ${caseEntity.docketNumber}.`,
          e,
        );
      }
    }
  }

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: pdfWithCoversheet,
    key: originalSubjectDocketEntry.docketEntryId,
  });

  const successMessage =
    docketNumbers.length > 1
      ? 'Document served to selected cases in group. '
      : 'Your entry has been added to the docket record.';

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId,
    message: {
      action: 'serve_document_complete',
      alertSuccess: {
        message: successMessage,
        overwritable: false,
      },
      pdfUrl: paperServicePdfUrl,
    },
    userId: user.userId,
  });
};

const fileDocumentOnOneCase = async ({
  applicationContext,
  caseEntity,
  consolidatedGroupHasPaperServiceCase,
  numberOfPages,
  originalSubjectDocketEntry,
  user,
}) => {
  const servedParties = aggregatePartiesForService(caseEntity);
  if (servedParties.paper.length > 0) {
    consolidatedGroupHasPaperServiceCase = true;
  }

  const docketEntryEntity = new DocketEntry(
    {
      ...originalSubjectDocketEntry,
      ...omit(originalSubjectDocketEntry, 'filedBy'),
      docketNumber: caseEntity.docketNumber,
      draftOrderState: null,
      filingDate: createISODateString(),
      isDraft: false,
      isFileAttached: true,
      isOnDocketRecord: true,
      numberOfPages,
      userId: user.userId,
    },
    { applicationContext },
  );

  docketEntryEntity.setAsServed(servedParties.all).validate();
  docketEntryEntity.setAsProcessingStatusAsCompleted();

  const subjectCaseDocketNumber = originalSubjectDocketEntry.docketNumber;

  const isSubjectCase = subjectCaseDocketNumber === caseEntity.docketNumber;

  if (!docketEntryEntity.workItem || !isSubjectCase) {
    docketEntryEntity.workItem = new WorkItem(
      {
        assigneeId: null,
        assigneeName: null,
        associatedJudge: caseEntity.associatedJudge,
        caseStatus: caseEntity.status,
        caseTitle: Case.getCaseTitle(caseEntity.caseCaption),
        docketEntry: {
          ...docketEntryEntity.toRawObject(),
          createdAt: docketEntryEntity.createdAt,
        },
        docketNumber: caseEntity.docketNumber,
        docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
        hideFromPendingMessages: true,
        inProgress: true,
        leadDocketNumber: subjectCaseDocketNumber,
        section: DOCKET_SECTION,
        sentBy: user.name,
        sentByUserId: user.userId,
      },
      { applicationContext },
    );
  }

  const workItemToUpdate = docketEntryEntity.workItem;

  if (workItemToUpdate) {
    workItemToUpdate.setAsCompleted({
      message: 'completed',
      user,
    });

    workItemToUpdate.assignToUser({
      assigneeId: user.userId,
      assigneeName: user.name,
      section: user.section,
      sentBy: user.name,
      sentBySection: user.section,
      sentByUserId: user.userId,
    });

    await applicationContext
      .getPersistenceGateway()
      .saveWorkItemForDocketClerkFilingExternalDocument({
        applicationContext,
        workItem: workItemToUpdate.validate().toRawObject(),
      });

    await applicationContext.getPersistenceGateway().saveWorkItem({
      applicationContext,
      workItem: workItemToUpdate.validate().toRawObject(),
    });

    await applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox({
      applicationContext,
      section: user.section,
      userId: user.userId,
      workItem: workItemToUpdate.validate().toRawObject(),
    });
  }

  if (
    caseEntity.docketEntries.some(
      docketEntry =>
        docketEntry.docketEntryId === docketEntryEntity.docketEntryId,
    )
  ) {
    caseEntity.updateDocketEntry(docketEntryEntity);
  } else {
    caseEntity.addDocketEntry(docketEntryEntity);
  }

  caseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAutomaticBlock({
      applicationContext,
      caseEntity,
    });

  const validRawCaseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity.validate(),
    });

  return {
    consolidatedGroupHasPaperServiceCase,
    newCase: new Case(validRawCaseEntity, { applicationContext }),
  };
};
