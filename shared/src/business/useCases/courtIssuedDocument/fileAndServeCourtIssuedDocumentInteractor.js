const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
const {
  ALLOWLIST_FEATURE_FLAGS,
  DOCKET_SECTION,
} = require('../../entities/EntityConstants');
const {
  createISODateString,
  formatDateString,
} = require('../../utilities/DateHandler');
const {
  ENTERED_AND_SERVED_EVENT_CODES,
  GENERIC_ORDER_DOCUMENT_TYPE,
} = require('../../entities/courtIssuedDocument/CourtIssuedDocumentConstants');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { DocketEntry } = require('../../entities/DocketEntry');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');
const { omit } = require('lodash');
const { TrialSession } = require('../../entities/trialSessions/TrialSession');
const { WorkItem } = require('../../entities/WorkItem');

/**
 * fileAndServeCourtIssuedDocumentInteractor
 *
 * @param {Object} applicationContext the application context
 * @param {Object} providers the providers object
 * @param {String} providers.docketEntryId the ID of the docket entry being filed and served
 * @param {String[]} providers.docketNumbers the docket numbers that this docket entry needs to be filed and served on, will be one or more docket numbers
 * @param {Object} providers.form the form from the front end that has last minute modifications to the docket entry
 * @param {String} providers.subjectCaseDocketNumber the docket number that initiated the filing and service
 * @returns {Object} the URL of the document that was served
 */
exports.fileAndServeCourtIssuedDocumentInteractor = async (
  applicationContext,
  { docketEntryId, docketNumbers, form, subjectCaseDocketNumber },
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

  const eventCodeCanOnlyBeServedOnSubjectCase =
    ENTERED_AND_SERVED_EVENT_CODES.includes(form.eventCode);
  const consolidateCaseDuplicateDocketEntries = await applicationContext
    .getUseCases()
    .getFeatureFlagValueInteractor(applicationContext, {
      featureFlag:
        ALLOWLIST_FEATURE_FLAGS.CONSOLIDATED_CASES_PROPAGATE_DOCKET_ENTRIES.key,
    });

  if (
    eventCodeCanOnlyBeServedOnSubjectCase ||
    !consolidateCaseDuplicateDocketEntries
  ) {
    docketNumbers = [subjectCaseDocketNumber];
  }

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

  const { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: originalSubjectDocketEntry.docketEntryId,
    })
    .promise();

  const stampedPdf = await stampDocument({
    applicationContext,
    form,
    pdfData,
  });

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
  let serviceResults;

  try {
    for (const docketNumber of docketNumbers) {
      const caseToUpdate = await applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber({
          applicationContext,
          docketNumber,
        });

      caseEntities.push(new Case(caseToUpdate, { applicationContext }));
    }

    const filedDocumentPromises = caseEntities.map(caseEntity =>
      fileDocumentOnOneCase({
        applicationContext,
        caseEntity,
        form,
        numberOfPages,
        originalSubjectDocketEntry,
        user,
      }),
    );
    caseEntities = await Promise.all(filedDocumentPromises);

    serviceResults = await applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf({
        applicationContext,
        caseEntities,
        docketEntryId: originalSubjectDocketEntry.docketEntryId,
        stampedPdf,
      });
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
    document: stampedPdf,
    key: originalSubjectDocketEntry.docketEntryId,
  });

  // return serviceResults;
  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    message: {
      action: 'file_and_serve_court_issued_document_complete',
      pdfUrl: serviceResults ? serviceResults.pdfUrl : undefined,
    },
    userId: user.userId,
  });
};

const stampDocument = async ({ applicationContext, form, pdfData }) => {
  const servedAt = createISODateString();

  let serviceStampType = 'Served';

  if (form.documentType === GENERIC_ORDER_DOCUMENT_TYPE) {
    serviceStampType = form.serviceStamp;
  } else if (ENTERED_AND_SERVED_EVENT_CODES.includes(form.eventCode)) {
    serviceStampType = 'Entered and Served';
  }

  const serviceStampDate = formatDateString(servedAt, 'MMDDYY');

  return await applicationContext.getUseCaseHelpers().addServedStampToDocument({
    applicationContext,
    pdfData,
    serviceStampText: `${serviceStampType} ${serviceStampDate}`,
  });
};

const fileDocumentOnOneCase = async ({
  applicationContext,
  caseEntity,
  form,
  numberOfPages,
  originalSubjectDocketEntry,
  user,
}) => {
  // Serve on all parties
  const servedParties = aggregatePartiesForService(caseEntity);

  const docketEntryEntity = new DocketEntry(
    {
      ...omit(originalSubjectDocketEntry, 'filedBy'),
      attachments: form.attachments,
      date: form.date,
      docketNumber: caseEntity.docketNumber,
      documentTitle: form.generatedDocumentTitle,
      documentType: form.documentType,
      draftOrderState: null,
      editState: JSON.stringify({
        ...form,
        docketEntryId: originalSubjectDocketEntry.docketEntryId,
        docketNumber: caseEntity.docketNumber,
      }),
      eventCode: form.eventCode,
      filingDate: createISODateString(),
      freeText: form.freeText,
      isDraft: false,
      isFileAttached: true,
      isOnDocketRecord: true,
      judge: form.judge, //TODO: should this judge come from the caseEntity or the form?
      numberOfPages,
      scenario: form.scenario,
      serviceStamp: form.serviceStamp,
      userId: user.userId,
    },
    { applicationContext },
  );

  docketEntryEntity.setAsServed(servedParties.all).validate();

  const isSubjectCase =
    originalSubjectDocketEntry.docketNumber === caseEntity.docketNumber;

  if (!docketEntryEntity.workItem || !isSubjectCase) {
    docketEntryEntity.workItem = new WorkItem(
      {
        assigneeId: null,
        assigneeName: null,
        associatedJudge: caseEntity.associatedJudge, //TODO: should this associatedJudge come from the caseEntity or the form?
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
        section: DOCKET_SECTION,
        sentBy: user.name,
        sentByUserId: user.userId,
      },
      { applicationContext },
    );
  }

  docketEntryEntity.workItem.assignToUser({
    assigneeId: user.userId,
    assigneeName: user.name,
    section: user.section,
    sentBy: user.name,
    sentBySection: user.section,
    sentByUserId: user.userId,
  });

  docketEntryEntity.workItem.setAsCompleted({ message: 'completed', user });

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

  await applicationContext.getPersistenceGateway().saveWorkItem({
    applicationContext,
    workItem: docketEntryEntity.workItem.validate().toRawObject(),
  });

  await applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox({
    applicationContext,
    section: user.section,
    userId: user.userId,
    workItem: docketEntryEntity.workItem.validate().toRawObject(),
  });

  caseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAutomaticBlock({
      applicationContext,
      caseEntity,
    });

  if (ENTERED_AND_SERVED_EVENT_CODES.includes(docketEntryEntity.eventCode)) {
    await closeCaseAndUpdatedTrialSessionForEnteredAndServedDocuments({
      applicationContext,
      caseEntity,
    });
  }

  const validRawCaseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  return new Case(validRawCaseEntity, { applicationContext });
};

const closeCaseAndUpdatedTrialSessionForEnteredAndServedDocuments = async ({
  applicationContext,
  caseEntity,
}) => {
  caseEntity.closeCase();

  await applicationContext
    .getPersistenceGateway()
    .deleteCaseTrialSortMappingRecords({
      applicationContext,
      docketNumber: caseEntity.docketNumber,
    });

  if (!caseEntity.trialSessionId) {
    return;
  }

  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId: caseEntity.trialSessionId,
    });

  const trialSessionEntity = new TrialSession(trialSession, {
    applicationContext,
  });

  if (trialSessionEntity.isCalendared) {
    trialSessionEntity.removeCaseFromCalendar({
      disposition: 'Status was changed to Closed',
      docketNumber: caseEntity.docketNumber,
    });
  } else {
    trialSessionEntity.deleteCaseFromCalendar({
      docketNumber: caseEntity.docketNumber,
    });
  }

  await applicationContext.getPersistenceGateway().updateTrialSession({
    applicationContext,
    trialSessionToUpdate: trialSessionEntity.validate().toRawObject(),
  });
};
