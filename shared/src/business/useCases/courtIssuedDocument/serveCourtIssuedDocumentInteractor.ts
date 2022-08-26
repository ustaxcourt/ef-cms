import { aggregatePartiesForService } from '../../utilities/aggregatePartiesForService';
import {
  ALLOWLIST_FEATURE_FLAGS,
  DOCKET_SECTION,
} from '../../entities/EntityConstants';
import {
  createISODateString,
  formatDateString,
} from '../../utilities/DateHandler';
import {
  ENTERED_AND_SERVED_EVENT_CODES,
  GENERIC_ORDER_DOCUMENT_TYPE,
} from '../../entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '../../../authorization/authorizationClientService';
import { addServedStampToDocument } from './addServedStampToDocument';
import { Case } from '../../entities/cases/Case';
import { DocketEntry } from '../../entities/DocketEntry';
import { NotFoundError, UnauthorizedError } from '../../../errors/errors';
import { TrialSession } from '../../entities/trialSessions/TrialSession';
import { WorkItem } from '../../entities/WorkItem';

const completeWorkItem = async ({
  applicationContext,
  docketEntryEntity,
  user,
  workItemToUpdate,
}) => {
  Object.assign(workItemToUpdate, {
    docketEntry: {
      ...docketEntryEntity.validate().toRawObject(),
    },
  });

  workItemToUpdate.assignToUser({
    assigneeId: user.userId,
    assigneeName: user.name,
    section: user.section ? user.section : DOCKET_SECTION,
    sentBy: user.name,
    sentBySection: user.section ? user.section : DOCKET_SECTION,
    sentByUserId: user.userId,
  });

  workItemToUpdate.setAsCompleted({ message: 'completed', user });

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
};

/**
 * serveCourtIssuedDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.clientConnectionId the UUID of the websocket connection for the current tab
 * @param {string} providers.subjectCaseDocketNumber the docket number of the case containing the document to serve
 * @param {String} providers.docketEntryId the ID of the docket entry being served
 * @param {String[]} providers.docketNumbers the docket numbers that this docket entry needs to be served on
 * @returns {object} the updated case after the document was served
 */
export const serveCourtIssuedDocumentInteractor = async (
  applicationContext,
  { clientConnectionId, docketEntryId, docketNumbers, subjectCaseDocketNumber },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.SERVE_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized for document service');
  }

  const subjectCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: subjectCaseDocketNumber,
    });

  if (!subjectCase.docketNumber) {
    throw new NotFoundError(`Case ${subjectCaseDocketNumber} was not found.`);
  }

  let subjectCaseEntity = new Case(subjectCase, { applicationContext });
  let caseEntities = [];
  caseEntities.push(subjectCaseEntity);

  const courtIssuedDocument = subjectCaseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!courtIssuedDocument) {
    throw new NotFoundError(`Docket entry ${docketEntryId} was not found.`);
  }
  if (courtIssuedDocument.servedAt) {
    throw new Error('Docket entry has already been served');
  }

  if (courtIssuedDocument.isPendingService) {
    throw new Error('Docket entry is already being served');
  } else {
    await applicationContext
      .getPersistenceGateway()
      .updateDocketEntryPendingServiceStatus({
        applicationContext,
        docketEntryId: courtIssuedDocument.docketEntryId,
        docketNumber: subjectCaseEntity.docketNumber,
        status: true,
      });
  }

  const eventCodeCanOnlyBeServedOnSubjectCase =
    ENTERED_AND_SERVED_EVENT_CODES.includes(courtIssuedDocument.eventCode);
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

  courtIssuedDocument.numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({
      applicationContext,
      docketEntryId,
    });

  const stampedPdf = await retrieveAndStampDocument({
    applicationContext,
    courtIssuedDocument,
    docketEntryId,
  });

  let serviceResults;

  try {
    for (const docketNumber of docketNumbers) {
      if (docketNumber !== subjectCaseDocketNumber) {
        const caseToUpdate = await applicationContext
          .getPersistenceGateway()
          .getCaseByDocketNumber({
            applicationContext,
            docketNumber,
          });

        caseEntities.push(new Case(caseToUpdate, { applicationContext }));
      }
    }

    const servedDocumentPromises = caseEntities.map(caseEntity =>
      serveDocumentOnOneCase({
        applicationContext,
        caseEntity,
        courtIssuedDocument,
        docketEntryId,
        subjectCaseDocketNumber,
        user,
      }),
    );

    caseEntities = await Promise.all(servedDocumentPromises);

    serviceResults = await applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf({
        applicationContext,
        caseEntities,
        docketEntryId,
        stampedPdf,
      });
  } finally {
    for (const caseEntity of caseEntities) {
      try {
        await applicationContext
          .getPersistenceGateway()
          .updateDocketEntryPendingServiceStatus({
            applicationContext,
            docketEntryId,
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
    key: docketEntryId,
  });

  const successMessage =
    docketNumbers.length > 1
      ? 'Document served to selected cases in group. '
      : 'Document served. ';

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId,
    message: {
      action: 'serve_court_issued_document_complete',
      alertSuccess: {
        message: successMessage,
        overwritable: false,
      },
      pdfUrl: serviceResults ? serviceResults.pdfUrl : undefined,
    },
    userId: user.userId,
  });
};

const serveDocumentOnOneCase = async ({
  applicationContext,
  caseEntity,
  courtIssuedDocument,
  docketEntryId,
  subjectCaseDocketNumber,
  user,
}) => {
  const docketEntryEntity = new DocketEntry(courtIssuedDocument, {
    applicationContext,
  });

  const servedParties = aggregatePartiesForService(caseEntity);

  docketEntryEntity.filingDate = createISODateString();
  docketEntryEntity.isOnDocketRecord = true;

  docketEntryEntity.setAsServed(servedParties.all);

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
        section: DOCKET_SECTION,
        sentBy: user.name,
        sentByUserId: user.userId,
      },
      { applicationContext },
    );
  }

  if (!caseEntity.getDocketEntryById({ docketEntryId })) {
    // updates docketNumber automatically
    caseEntity.addDocketEntry(docketEntryEntity);
  }

  const workItemToUpdate = docketEntryEntity.workItem;

  await completeWorkItem({
    applicationContext,
    docketEntryEntity,
    user,
    workItemToUpdate,
  });

  docketEntryEntity.validate();

  caseEntity.updateDocketEntry(docketEntryEntity);

  caseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAutomaticBlock({
      applicationContext,
      caseEntity,
    });

  if (ENTERED_AND_SERVED_EVENT_CODES.includes(courtIssuedDocument.eventCode)) {
    await closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments({
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

const retrieveAndStampDocument = async ({
  applicationContext,
  courtIssuedDocument,
  docketEntryId,
}) => {
  const { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: docketEntryId,
    })
    .promise();

  let serviceStampType = 'Served';

  if (courtIssuedDocument.documentType === GENERIC_ORDER_DOCUMENT_TYPE) {
    serviceStampType = courtIssuedDocument.serviceStamp;
  } else if (
    ENTERED_AND_SERVED_EVENT_CODES.includes(courtIssuedDocument.eventCode)
  ) {
    serviceStampType = 'Entered and Served';
  }

  const servedAt = createISODateString();
  const serviceStampDate = formatDateString(servedAt, 'MMDDYY');

  return await addServedStampToDocument({
    applicationContext,
    pdfData,
    serviceStampText: `${serviceStampType} ${serviceStampDate}`,
  });
};

const closeCaseAndUpdateTrialSessionForEnteredAndServedDocuments = async ({
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
