import { Case } from '../../entities/cases/Case';
import {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  DOCUMENT_SERVED_MESSAGES,
  SIMULTANEOUS_DOCUMENT_EVENT_CODES,
} from '../../entities/EntityConstants';
import { DocketEntry } from '../../entities/DocketEntry';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

/**
 * serveExternallyFiledDocumentInteractor
 * @param {Object} applicationContext the application context
 * @param {Object} providers the providers object
 * @param {object} providers.clientConnectionId the client connection Id
 * @param {String} providers.docketEntryId the ID of the docket entry being filed and served
 * @param {String[]} providers.docketNumbers the docket numbers that this docket entry needs to be filed and served on, will be one or more docket numbers
 * @param {String} providers.subjectCaseDocketNumber the docket number that initiated the filing and service
 */
export const serveExternallyFiledDocument = async (
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

  const subjectCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber: subjectCaseDocketNumber,
    });

  const subjectCaseEntity = new Case(subjectCase, { applicationContext });

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
      Key: docketEntryId,
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
      docketEntryId,
      docketNumber: subjectCaseDocketNumber,
      status: true,
    });

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  let paperServiceResult;
  let caseEntities: Case[] = [];
  const coversheetLength = 1;

  const subjectCaseIsSimultaneousDocType =
    SIMULTANEOUS_DOCUMENT_EVENT_CODES.includes(
      originalSubjectDocketEntry.eventCode,
    ) || originalSubjectDocketEntry.documentTitle?.includes('Simultaneous');

  if (subjectCaseIsSimultaneousDocType) {
    docketNumbers = [subjectCaseDocketNumber];
  } else {
    docketNumbers = [subjectCaseDocketNumber, ...docketNumbers];
  }

  try {
    caseEntities = await Promise.all(
      docketNumbers.map(async docketNumber => {
        const rawCaseToUpdate = await applicationContext
          .getPersistenceGateway()
          .getCaseByDocketNumber({
            applicationContext,
            docketNumber,
          });

        const caseEntity = new Case(rawCaseToUpdate, {
          applicationContext,
        });

        const isSubjectCase =
          caseEntity.docketNumber === subjectCaseDocketNumber;

        const docketEntryEntity = new DocketEntry(
          {
            ...originalSubjectDocketEntry,
            docketNumber: caseEntity.docketNumber,
            draftOrderState: null,
            ...(!subjectCaseIsSimultaneousDocType && {
              filingDate: applicationContext
                .getUtilities()
                .createISODateString(),
            }),
            isDraft: false,
            isFileAttached: true,
            isOnDocketRecord: true,
            isPendingService: isSubjectCase,
            numberOfPages: numberOfPages + coversheetLength,
            processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
          },
          { applicationContext },
        );

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

    const updatedSubjectCaseEntity = caseEntities.find(
      c => c.docketNumber === subjectCaseDocketNumber,
    );
    const updatedSubjectDocketEntry =
      updatedSubjectCaseEntity!.getDocketEntryById({ docketEntryId });

    await applicationContext
      .getUseCases()
      .addCoversheetInteractor(applicationContext, {
        caseEntity: updatedSubjectCaseEntity,
        docketEntryId: updatedSubjectDocketEntry.docketEntryId,
        docketNumber: updatedSubjectCaseEntity!.docketNumber,
      });

    paperServiceResult = await applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf({
        applicationContext,
        caseEntities,
        docketEntryId,
      });
  } finally {
    await applicationContext
      .getPersistenceGateway()
      .updateDocketEntryPendingServiceStatus({
        applicationContext,
        docketEntryId,
        docketNumber: subjectCaseDocketNumber,
        status: false,
      });
  }

  const successMessage =
    docketNumbers.length > 1
      ? DOCUMENT_SERVED_MESSAGES.SELECTED_CASES
      : DOCUMENT_SERVED_MESSAGES.ENTRY_ADDED;

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId,
    message: {
      action: 'serve_document_complete',
      alertSuccess: {
        message: successMessage,
        overwritable: false,
      },
      pdfUrl: paperServiceResult && paperServiceResult.pdfUrl,
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
  originalRequest: any,
) => {
  const user = applicationContext.getCurrentUser();

  await applicationContext.getNotificationGateway().sendNotificationToUser({
    applicationContext,
    clientConnectionId: originalRequest.clientConnectionId,
    message: {
      action: 'retry_async_request',
      originalRequest,
      requestToRetry: 'serve_externally_filed_document',
    },
    userId: user.userId,
  });
};

export const serveExternallyFiledDocumentInteractor = withLocking(
  serveExternallyFiledDocument,
  determineEntitiesToLock,
  handleLockError,
);
