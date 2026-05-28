import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { createISODateString } from '@shared/business/utilities/DateHandler';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { omit } from 'lodash';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import { Case, isLeadCase } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  DOCUMENT_SERVED_MESSAGES,
} from '@shared/business/entities/EntityConstants';
import { fileAndServeDocumentOnOneCase } from '@web-api/business/useCaseHelper/docketEntry/fileAndServeDocumentOnOneCase';
import { updateDocketEntryPendingServiceStatus } from '@web-api/persistence/postgres/docketEntries/updateDocketEntryPendingServiceStatus';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import {
  asyncHandleLockError,
  withLocking,
} from '@web-api/persistence/postgres/utils/mutex';
import {
  onTransactionCommit,
  withTransaction,
} from '@web-api/persistence/postgres/utils/transactions';
import { upsertCaseDeadlines } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines';
import {
  CaseDeadline,
  RawCaseDeadline,
} from '@shared/business/entities/CaseDeadline';
import { getConsolidatedCases } from '@web-api/persistence/postgres/cases/getConsolidatedCases';
import { CourtIssuedDocumentAnyType } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { addAssociatedDocketEntries } from '@web-api/business/useCaseHelper/docketEntry/addAssociatedDocketEntries';

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
    form: CourtIssuedDocumentAnyType;
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

  const user = await getUserById({ userId: authorizedUser.userId });

  if (!user) {
    throw new NotFoundError(`Could not find user ${authorizedUser.userId}`);
  }

  const subjectCase = await getCaseByDocketNumber({
    docketNumber: subjectCaseDocketNumber,
  });

  const subjectCaseEntity = new Case(subjectCase, { authorizedUser });

  const docketEntryToServe = subjectCaseEntity.getDocketEntryById({
    docketEntryId,
  });

  const throwError = async error => {
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: { action: 'serve_document_error', error: error.message },
      userId: user.userId,
    });

    throw error;
  };

  if (!docketEntryToServe) {
    return await throwError(
      new NotFoundError(`Docket entry ${docketEntryId} was not found.`),
    );
  }

  if (docketEntryToServe.servedAt) {
    await throwError(new Error('Docket entry has already been served'));
  } else if (docketEntryToServe.isPendingService) {
    await throwError(new Error('Docket entry is already being served'));
  }

  const stampedPdf = await applicationContext
    .getUseCaseHelpers()
    .stampDocumentForService({
      applicationContext,
      documentStorageId: docketEntryToServe.documentStorageId,
      documentToStamp: form,
    });

  const numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({
      applicationContext,
      documentBytes: stampedPdf,
    });

  let documentContentsId;
  let scrapedDocumentContents: string | undefined;
  try {
    const shouldScrapePDFContents = DocketEntry.isSearchable(form.eventCode);

    if (shouldScrapePDFContents) {
      scrapedDocumentContents = await applicationContext
        .getUseCaseHelpers()
        .parseAndScrapePdfContents({
          applicationContext,
          pdfBuffer: stampedPdf,
        });

      scrapedDocumentContents = `${scrapedDocumentContents} ${subjectCase.docketNumberWithSuffix} ${subjectCase.caseCaption}`;
      documentContentsId = applicationContext.getUniqueId();
    }
  } catch (e) {
    applicationContext.logger.error(e);
  }

  // Upload documents to S3 BEFORE the transaction. These don't need any data from
  // the transaction, and must be available before emails are sent (so parties can
  // access the served document). If uploads succeed but the transaction fails,
  // orphaned files in S3 are acceptable.
  if (scrapedDocumentContents) {
    const contentToStore = { documentContents: scrapedDocumentContents };
    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      contentType: 'application/json',
      document: Buffer.from(JSON.stringify(contentToStore)),
      key: documentContentsId,
      useTempBucket: false,
    });
  }

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    document: stampedPdf,
    key: docketEntryToServe.documentStorageId,
  });

  let caseEntities: Case[] = [];
  let serviceResults;

  await withTransaction(async () => {
    await updateDocketEntryPendingServiceStatus({
      docketEntryId: docketEntryToServe.docketEntryId,
      docketNumber: subjectCaseDocketNumber,
      status: true,
    });

    try {
      const casesToUpdate = await getCasesByDocketNumbers({
        docketNumbers: [...docketNumbers, subjectCaseDocketNumber],
      });

      for (const caseToUpdate of casesToUpdate) {
        caseEntities.push(new Case(caseToUpdate, { authorizedUser }));
      }

      const multiDocketedOn: string[] =
        docketNumbers.length > 0
          ? [subjectCaseDocketNumber, ...docketNumbers]
          : [];

      caseEntities = await settlePromises(
        caseEntities.map(async caseEntity => {
          const docketEntryEntity = new DocketEntry(
            {
              ...omit(docketEntryToServe, ['filedBy', 'index']),
              attachments: form.attachments,
              date: form.date,
              docketNumber: caseEntity.docketNumber,
              docketNumbers: form.docketNumbers,
              documentContentsId,
              documentTitle: form.generatedDocumentTitle,
              documentType: form.documentType,
              draftOrderState: {
                orderType: form.orderType,
              },
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
              multiDocketedOn,
              originallyFiledDocketNumber: subjectCaseDocketNumber,
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

            const deadline = (
              await applicationContext
                .getUseCaseHelpers()
                .autoGenerateDeadline({
                  deadlineDate: docketEntryEntity.date,
                  description:
                    docketEntryEntity.getAutoGeneratedDeadlineDescription(),
                  subjectCaseEntity,
                })
            )[0];

            if (isLeadCase(caseEntity)) {
              const consolidatedCases = await getConsolidatedCases({
                leadDocketNumber: caseEntity.leadDocketNumber!,
              });

              const childCaseDeadlines: RawCaseDeadline[] = [];
              for (const c of consolidatedCases) {
                if (c.docketNumber === caseEntity.leadDocketNumber) continue;

                childCaseDeadlines.push(
                  new CaseDeadline({
                    associatedJudge: c.associatedJudge,
                    associatedJudgeId: c.associatedJudgeId,
                    consolidatedCaseDeadlineId: deadline.caseDeadlineId,
                    deadlineDate: deadline.deadlineDate,
                    description: deadline.description,
                    docketNumber: c.docketNumber,
                    sortableDocketNumber: c.sortableDocketNumber,
                  }).toRawObject(),
                );
              }

              await upsertCaseDeadlines(childCaseDeadlines);
            }
          }

          return fileAndServeDocumentOnOneCase({
            caseEntity,
            docketEntryEntity,
            user,
            caseHasDeadline,
          });
        }),
      );

      if (form.affectedDocketEntries) {
        await addAssociatedDocketEntries(
          casesToUpdate,
          form,
          docketEntryToServe,
          true,
        );
      }

      // NOTE: serveDocumentAndGetPaperServicePdf must be called INSIDE the transaction.
      // The fileAndServeDocumentOnOneCase calls above set servedAt timestamps on docket entries
      // via docketEntryEntity.setAsServed(), which are persisted by updateCaseAndAssociations.
      // This helper is transaction-aware and checks inTransaction() - since we're inside the
      // transaction, it will defer email sending via onTransactionCommit. This ensures servedAt
      // is only committed if emails successfully queue. The helper also generates paper service
      // PDFs, but those are uploaded to a temp bucket so orphaned PDFs are acceptable.
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

    onTransactionCommit(async () => {
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
    });
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
