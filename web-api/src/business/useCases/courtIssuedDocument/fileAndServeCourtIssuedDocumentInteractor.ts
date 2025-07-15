import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { omit } from 'lodash';
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
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  DOCUMENT_SERVED_MESSAGES,
} from '@shared/business/entities/EntityConstants';
import { fileAndServeDocumentOnOneCase } from '@web-api/business/useCaseHelper/docketEntry/fileAndServeDocumentOnOneCase';
import { updateDocketEntryPendingServiceStatus } from '@web-api/persistence/postgres/docketEntries/updateDocketEntryPendingServiceStatus';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { settlePromises } from '@web-api/utilities/settlePromises';

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

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const subjectCase = await getCaseByDocketNumber({
    applicationContext,
    docketNumber: subjectCaseDocketNumber,
  });

  const subjectCaseEntity = new Case(subjectCase, { authorizedUser });

  const docketEntryToServe = subjectCaseEntity.getDocketEntryById({
    docketEntryId,
  });

  let error: Error | undefined;
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
      message: { action: 'serve_document_error', error: error.message },
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

  await updateDocketEntryPendingServiceStatus({
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

      const contentToStore = { documentContents };

      await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
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
    const casesToUpdate = await getCasesByDocketNumbers({
      docketNumbers: [...docketNumbers, subjectCaseDocketNumber],
    });

    for (const caseToUpdate of casesToUpdate) {
      caseEntities.push(new Case(caseToUpdate, { authorizedUser }));
    }

    caseEntities = await settlePromises(
      caseEntities.map(async caseEntity => {
        const docketEntryEntity = new DocketEntry(
          {
            ...omit(docketEntryToServe, 'filedBy'),
            attachments: form.attachments,
            date: form.date,
            docketNumber: caseEntity.docketNumber,
            docketNumbers: form.docketNumbers,
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
          { authorizedUser },
        );

        docketEntryEntity.setFiledBy(user);

        const isSubjectCase =
          caseEntity.docketNumber === subjectCaseEntity.docketNumber;

        let caseHasDeadline: boolean | undefined = undefined;
        if (isSubjectCase && docketEntryEntity.shouldAutoGenerateDeadline()) {
          caseHasDeadline = true;
          await applicationContext.getUseCaseHelpers().autoGenerateDeadline({
            deadlineDate: docketEntryEntity.date,
            description:
              docketEntryEntity.getAutoGeneratedDeadlineDescription(),
            subjectCaseEntity,
          });
        }

        return fileAndServeDocumentOnOneCase({
          caseEntity,
          docketEntryEntity,
          subjectCaseDocketNumber,
          user,
          caseHasDeadline,
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
        await updateDocketEntryPendingServiceStatus({
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
      alertSuccess: { message: successMessage, overwritable: false },
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
  }: { docketNumbers?: string[]; subjectCaseDocketNumber: string },
) => ({
  identifiers: [...new Set([...docketNumbers, subjectCaseDocketNumber])].map(
    item => `case|${item}`,
  ),
  ttl: 900,
});

export const fileAndServeCourtIssuedDocumentInteractor = withLocking(
  fileAndServeCourtIssuedDocument,
  determineEntitiesToLock,
  asyncHandleLockError,
);
