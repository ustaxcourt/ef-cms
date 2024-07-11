import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  DOCUMENT_SERVED_MESSAGES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { DocketEntry } from '../../../../../shared/src/business/entities/DocketEntry';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { omit } from 'lodash';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';

export const fileAndServeCourtIssuedDocument = async (
  applicationContext: ServerApplicationContext,
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
): Promise<void> => {
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

  const stampedPdf = await applicationContext
    .getUseCaseHelpers()
    .stampDocumentForService({
      applicationContext,
      docketEntryId: docketEntryToServe.docketEntryId,
      documentToStamp: form,
    });

  const numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({
      applicationContext,
      docketEntryId,
      documentBytes: stampedPdf,
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
  let documentContentsId;
  try {
    const shouldScrapePDFContents =
      !docketEntryToServe.documentContents &&
      DocketEntry.isSearchable(form.eventCode);

    if (shouldScrapePDFContents) {
      let documentContents: string = await applicationContext
        .getUseCaseHelpers()
        .parseAndScrapePdfContents({
          applicationContext,
          pdfBuffer: stampedPdf,
        });

      documentContents = `${documentContents} ${subjectCase.docketNumberWithSuffix} ${subjectCase.caseCaption}`;
      documentContentsId = applicationContext.getUniqueId();

      const contentToStore = {
        documentContents,
      };

      await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
        applicationContext,
        contentType: 'application/json',
        document: Buffer.from(JSON.stringify(contentToStore)),
        key: documentContentsId,
        useTempBucket: false,
      });
    }
  } catch (e) {
    applicationContext.logger.error(e);
  }

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
            documentContentsId,
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
  _applicationContext: ServerApplicationContext,
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

export const handleLockError = async (applicationContext, originalRequest) => {
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
