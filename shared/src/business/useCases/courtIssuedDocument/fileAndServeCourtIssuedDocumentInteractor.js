const {
  aggregatePartiesForService,
} = require('../../utilities/aggregatePartiesForService');
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
const { addServedStampToDocument } = require('./addServedStampToDocument');
const { Case } = require('../../entities/cases/Case');
const { DOCKET_SECTION } = require('../../entities/EntityConstants');
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
 * @param {String} providers.documentMeta the document metadata
 * @returns {Object} the url of the document that was served
 */
exports.fileAndServeCourtIssuedDocumentInteractor = async (
  applicationContext,
  { documentMeta },
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

  //TODO: rename variables with 'lead' in the name to avoid confusion when dealing with a single case
  const { docketEntryId, docketNumbers, leadCaseDocketNumber } = documentMeta;

  // flag to indicate whether we are updating a single case or an array of consolidated cases
  const singleCaseOperation = docketNumbers.length === 1;

  const leadCaseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: leadCaseDocketNumber,
    });

  let leadCaseEntity = new Case(leadCaseToUpdate, { applicationContext });

  const leadDocketEntryOld = leadCaseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!leadDocketEntryOld) {
    throw new NotFoundError('Docket entry not found');
  }
  if (leadDocketEntryOld.servedAt) {
    throw new Error('Docket entry has already been served');
  }
  if (leadDocketEntryOld.isPendingService) {
    throw new Error('Docket entry is already being served');
  }

  await applicationContext
    .getPersistenceGateway()
    .updateDocketEntryPendingServiceStatus({
      applicationContext,
      docketEntryId: leadDocketEntryOld.docketEntryId,
      docketNumber: leadCaseDocketNumber,
      status: true,
    });

  const stampedPdf = await stampDocument({
    applicationContext,
    documentMeta,
    leadDocketEntryOld,
  });

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  let caseEntities = [];
  for (const docketNumber of docketNumbers) {
    const caseToUpdate = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      });

    caseEntities.push(new Case(caseToUpdate, { applicationContext }));
  }

  let serviceResults;
  try {
    const filedDocumentPromises = caseEntities.map(caseEntity =>
      fileDocumentOnOneCase({
        applicationContext,
        caseEntity,
        docketEntryId,
        documentMeta,
        leadDocketEntryOld,
        singleCaseOperation,
        user,
      }),
    );
    caseEntities = await Promise.all(filedDocumentPromises);

    serviceResults = await applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf({
        applicationContext,
        caseEntities,
        docketEntryId: leadDocketEntryOld.docketEntryId,
      });
  } finally {
    for (const caseEntity of caseEntities) {
      // updated to conditional update to avoid creating record if it does not already exist
      await applicationContext
        .getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus({
          applicationContext,
          docketEntryId: leadDocketEntryOld.docketEntryId,
          docketNumber: caseEntity.docketNumber,
          status: false,
        });
    }
  }

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: stampedPdf,
    key: leadDocketEntryOld.docketEntryId,
  });

  return serviceResults;
};

const stampDocument = async ({
  applicationContext,
  documentMeta,
  leadDocketEntry,
}) => {
  const leadDocketEntryEntityForServiceStampOnly = new DocketEntry(
    {
      ...omit(leadDocketEntry, 'filedBy'),
      documentTitle: documentMeta.generatedDocumentTitle,
      documentType: documentMeta.documentType,
      eventCode: documentMeta.eventCode,
      servedAt: documentMeta.servedAt,
      serviceStamp: documentMeta.serviceStamp,
    },
    { applicationContext },
  );

  const { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: leadDocketEntryEntityForServiceStampOnly.docketEntryId,
    })
    .promise();

  let serviceStampType = 'Served';

  if (
    leadDocketEntryEntityForServiceStampOnly.documentType ===
    GENERIC_ORDER_DOCUMENT_TYPE
  ) {
    serviceStampType = leadDocketEntryEntityForServiceStampOnly.serviceStamp;
  } else if (
    ENTERED_AND_SERVED_EVENT_CODES.includes(
      leadDocketEntryEntityForServiceStampOnly.eventCode,
    )
  ) {
    serviceStampType = 'Entered and Served';
  }

  const serviceStampDate = formatDateString(
    leadDocketEntryEntityForServiceStampOnly.servedAt,
    'MMDDYY',
  );

  return await addServedStampToDocument({
    applicationContext,
    pdfData,
    serviceStampText: `${serviceStampType} ${serviceStampDate}`,
  });
};

const fileDocumentOnOneCase = async ({
  applicationContext,
  caseEntity,
  docketEntryId,
  documentMeta,
  leadDocketEntryOld,
  singleCaseOperation,
  user,
}) => {
  // numberOfPages shouldn't need to be recalculated for each docket entry, despite not yet being updated, right????
  const numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({ applicationContext, docketEntryId });

  // Serve on all parties
  const servedParties = aggregatePartiesForService(caseEntity);

  const docketEntryEntity = new DocketEntry(
    {
      ...omit(leadDocketEntryOld, 'filedBy'),
      attachments: documentMeta.attachments,
      date: documentMeta.date,
      docketNumber: caseEntity.docketNumber,
      documentTitle: documentMeta.generatedDocumentTitle,
      documentType: documentMeta.documentType,
      draftOrderState: null,
      editState: JSON.stringify(documentMeta),
      eventCode: documentMeta.eventCode,
      filingDate: createISODateString(),
      freeText: documentMeta.freeText,
      isDraft: false,
      isFileAttached: true,
      isOnDocketRecord: true,
      judge: documentMeta.judge,
      numberOfPages,
      scenario: documentMeta.scenario,
      serviceStamp: documentMeta.serviceStamp,
      userId: user.userId,
    },
    { applicationContext },
  );

  docketEntryEntity.setAsServed(servedParties.all).validate();

  if (!docketEntryEntity.workItem) {
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

  if (caseEntity.docketNumber !== caseEntity.leadDocketNumber) {
    caseEntity.addDocketEntry(docketEntryEntity);
  } else {
    caseEntity.updateDocketEntry(docketEntryEntity);
  }

  //TODO: this might fail on a sub-case because the docket entry on the sub-case isn't created in DynamoDB yet

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

  // only allow closing the case if a `Entered and Served` document is being filed on ONE case
  const shouldCloseCase =
    singleCaseOperation &&
    ENTERED_AND_SERVED_EVENT_CODES.includes(docketEntryEntity.eventCode);

  if (shouldCloseCase) {
    closeCaseAndUpdatedTrialSessionForEnteredAndServedDocuments({
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

  if (caseEntity.trialSessionId) {
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
  }
};
