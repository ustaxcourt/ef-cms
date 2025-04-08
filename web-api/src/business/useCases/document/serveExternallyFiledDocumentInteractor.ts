import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import {
  asyncHandleLockError,
  withLocking,
} from '@web-api/business/useCaseHelper/acquireLock';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import {
  SIMULTANEOUS_DOCUMENT_EVENT_CODES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  DOCUMENT_SERVED_MESSAGES,
} from '@shared/business/entities/EntityConstants';
import { fileAndServeDocumentOnOneCase } from '@web-api/business/useCaseHelper/docketEntry/fileAndServeDocumentOnOneCase';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';

export const serveExternallyFiledDocument = async (
  applicationContext: ServerApplicationContext,
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
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
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

  const subjectCase = await getCaseByDocketNumber({
    applicationContext,
    docketNumber: subjectCaseDocketNumber,
  });

  const subjectCaseEntity = new Case(subjectCase, { authorizedUser });

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

  const numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({ applicationContext, docketEntryId });

  await applicationContext
    .getPersistenceGateway()
    .updateDocketEntryPendingServiceStatus({
      applicationContext,
      docketEntryId,
      docketNumber: subjectCaseDocketNumber,
      status: true,
    });

  const user = await getUserById({ userId: authorizedUser.userId });

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
        const rawCaseToUpdate = await getCaseByDocketNumber({
          applicationContext,
          docketNumber,
        });

        const caseEntity = new Case(rawCaseToUpdate, { authorizedUser });

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
          { authorizedUser },
        );

        return fileAndServeDocumentOnOneCase({
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

    await applicationContext.getUseCases().addCoversheetInteractor(
      applicationContext,
      {
        caseEntity: updatedSubjectCaseEntity,
        docketEntryId: updatedSubjectDocketEntry.docketEntryId,
        docketNumber: updatedSubjectCaseEntity!.docketNumber,
      },
      authorizedUser,
    );

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
      alertSuccess: { message: successMessage, overwritable: false },
      pdfUrl: paperServiceResult && paperServiceResult.pdfUrl,
    },
    userId: user.userId,
  });
};

export const determineEntitiesToLock = (
  _applicationContext: ServerApplicationContext,
  {
    docketNumbers = [],
    subjectCaseDocketNumber,
  }: { docketNumbers?: string[]; subjectCaseDocketNumber: string },
) => ({
  identifiers: [...new Set([...docketNumbers, subjectCaseDocketNumber])].map(
    item => `case|${item}`,
  ),
  ttl: 900,
});

export const serveExternallyFiledDocumentInteractor = withLocking(
  serveExternallyFiledDocument,
  determineEntitiesToLock,
  asyncHandleLockError,
);
