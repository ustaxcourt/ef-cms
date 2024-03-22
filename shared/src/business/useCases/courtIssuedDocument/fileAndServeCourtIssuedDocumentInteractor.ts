import { Case } from '../../entities/cases/Case';
import {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  DOCUMENT_SERVED_MESSAGES,
} from '../../entities/EntityConstants';
import { DocketEntry } from '../../entities/DocketEntry';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { createISODateString } from '../../utilities/DateHandler';
import { omit } from 'lodash';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

/**
 * fileAndServeCourtIssuedDocumentInteractor
 * @param {Object} applicationContext the application context
 * @param {Object} providers the providers object
 * @param {string} providers.clientConnectionId the UUID of the websocket connection for the current tab
 * @param {String} providers.docketEntryId the ID of the docket entry being filed and served
 * @param {String[]} providers.docketNumbers the docket numbers that this docket entry needs to be filed and served on, will be one or more docket numbers
 * @param {Object} providers.form the form from the front end that has last minute modifications to the docket entry
 * @param {String} providers.subjectCaseDocketNumber the docket number that initiated the filing and service
 * @returns {Object} the URL of the document that was served
 */
export const fileAndServeCourtIssuedDocument = async (
  applicationContext: IApplicationContext,
  {
    clientConnectionId,
    docketEntryId,
    docketNumbers,
    form,
    subjectCaseDocketNumber,
  }: {
    clientConnectionId: string;
    docketEntryId: string;
    docketNumbers: string[];
    form: any;
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

  const subjectCaseEntity = new Case(subjectCase, { applicationContext });

  const docketEntryToServe = subjectCaseEntity.getDocketEntryById({
    docketEntryId,
  });

  let error;
  if (!docketEntryToServe) {
    error = new NotFoundError(`Docket entry ${docketEntryId} was not found.`);
  } else if (docketEntryToServe.servedAt) {
    error = new Error('Docket entry has already been served');
  } else if (docketEntryToServe.isPendingService) {
    error = new Error('Docket entry is already being served');
  }
  if (error) {
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: {
        action: 'serve_document_error',
        error: error.message,
      },
      userId: user.userId,
    });

    throw error;
  }

  const { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: docketEntryToServe.docketEntryId,
    })
    .promise();

  const stampedPdf = await applicationContext
    .getUseCaseHelpers()
    .stampDocumentForService({
      applicationContext,
      documentToStamp: form,
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
      docketEntryId: docketEntryToServe.docketEntryId,
      docketNumber: subjectCaseDocketNumber,
      status: true,
    });

  let caseEntities: Case[] = [];
  let serviceResults;

  try {
    for (const docketNumber of [...docketNumbers, subjectCaseDocketNumber]) {
      const caseToUpdate = await applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber({
          applicationContext,
          docketNumber,
        });

      caseEntities.push(new Case(caseToUpdate, { applicationContext }));
    }

    caseEntities = await Promise.all(
      caseEntities.map(async caseEntity => {
        const docketEntryEntity = new DocketEntry(
          {
            ...omit(docketEntryToServe, 'filedBy'),
            attachments: form.attachments,
            date: form.date,
            docketNumber: caseEntity.docketNumber,
            documentTitle: form.generatedDocumentTitle,
            documentType: form.documentType,
            editState: JSON.stringify({
              ...form,
              docketEntryId: docketEntryToServe.docketEntryId,
              docketNumber: caseEntity.docketNumber,
            }),
            eventCode: form.eventCode,
            filingDate: createISODateString(),
            freeText: form.freeText,
            isDraft: false,
            isFileAttached: true,
            isOnDocketRecord: true,
            judge: form.judge,
            numberOfPages,
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
            scenario: form.scenario,
            serviceStamp: form.serviceStamp,
            trialLocation: form.trialLocation,
          },
          { applicationContext },
        );

        docketEntryEntity.setFiledBy(user);

        const isSubjectCase =
          caseEntity.docketNumber === subjectCaseEntity.docketNumber;

        if (isSubjectCase && docketEntryEntity.shouldAutoGenerateDeadline()) {
          await applicationContext.getUseCaseHelpers().autoGenerateDeadline({
            applicationContext,
            deadlineDate: docketEntryEntity.date,
            description:
              docketEntryEntity.getAutoGeneratedDeadlineDescription(),
            subjectCaseEntity,
          });
        }

        return applicationContext
          .getUseCaseHelpers()
          .fileAndServeDocumentOnOneCase({
            applicationContext,
            caseEntity,
            docketEntryEntity,
            subjectCaseDocketNumber,
            user,
          });
      }),
    );

    serviceResults = await applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf({
        applicationContext,
        caseEntities,
        docketEntryId: docketEntryToServe.docketEntryId,
        stampedPdf,
      });
  } finally {
    for (const caseEntity of caseEntities) {
      try {
        await applicationContext
          .getPersistenceGateway()
          .updateDocketEntryPendingServiceStatus({
            applicationContext,
            docketEntryId: docketEntryToServe.docketEntryId,
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
    key: docketEntryToServe.docketEntryId,
  });

  const successMessage =
    docketNumbers.length > 0
      ? DOCUMENT_SERVED_MESSAGES.SELECTED_CASES
      : DOCUMENT_SERVED_MESSAGES.GENERIC;

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId,
    message: {
      action: 'serve_document_complete',
      alertSuccess: {
        message: successMessage,
        overwritable: false,
      },
      pdfUrl: serviceResults ? serviceResults.pdfUrl : undefined,
    },
    userId: user.userId,
  });
};

export const determineEntitiesToLock = (
  _applicationContext: IApplicationContext,
  {
    docketNumbers = [],
    subjectCaseDocketNumber,
  }: {
    docketNumbers?: string[];
    subjectCaseDocketNumber: string;
  },
) => ({
  identifiers: [...new Set([...docketNumbers, subjectCaseDocketNumber])].map(
    item => `case|${item}`,
  ),
  ttl: 900,
});

export const handleLockError = async (
  applicationContext: IApplicationContext,
  originalRequest,
) => {
  const user = applicationContext.getCurrentUser();

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId: originalRequest.clientConnectionId,
    message: {
      action: 'retry_async_request',
      originalRequest,
      requestToRetry: 'file_and_serve_court_issued_document',
    },
    userId: user.userId,
  });
};

export const fileAndServeCourtIssuedDocumentInteractor = withLocking(
  fileAndServeCourtIssuedDocument,
  determineEntitiesToLock,
  handleLockError,
);
