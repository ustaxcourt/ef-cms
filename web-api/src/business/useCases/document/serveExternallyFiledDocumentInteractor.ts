import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import {
  SIMULTANEOUS_DOCUMENT_EVENT_CODES,
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
  prependCoversheetWithQpdfAndPersist,
  runPaperServiceWithQpdf,
} from '@web-api/business/useCaseHelper/document/serveDocumentWithQpdf';
import { qpdfPageCount } from '@web-api/utilities/qpdf';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

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

  // qpdf path: stage the source PDF on /tmp once and operate on file paths
  // from here on. The interactor owns the scratch directory lifecycle so the
  // two qpdf helpers can share the cover-attached file without re-fetching
  // it from S3, and so a mid-flight failure can't leak files on a
  // warm-reused Lambda /tmp.
  const workDir = await mkdtemp(path.join(os.tmpdir(), 'serve-'));
  const originalPdfPath = path.join(workDir, 'orig.pdf');
  const { documentStorageId } = originalSubjectDocketEntry;

  try {
    const originalBytes = await applicationContext
      .getPersistenceGateway()
      .getDocument({
        applicationContext,
        key: documentStorageId,
      });
    await writeFile(originalPdfPath, originalBytes);
    const numberOfPages = await qpdfPageCount(originalPdfPath);

    await updateDocketEntryPendingServiceStatus({
      docketEntryId,
      docketNumber: subjectCaseDocketNumber,
      status: true,
    });

    const user = await getUserById({ userId: authorizedUser.userId });

    if (!user) {
      throw new NotFoundError(
        `User not found with user id ${authorizedUser.userId}`,
      );
    }

    let paperServiceResult: { pdfUrl?: string } = {};
    let caseEntities: Case[] = [];

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
      const casesToUpdate = await getCasesByDocketNumbers({ docketNumbers });
      caseEntities = await settlePromises(
        casesToUpdate.map(async rawCaseToUpdate => {
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
              numberOfPages,
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

      if (!updatedSubjectDocketEntry) {
        throw new NotFoundError(
          `Could not find docket entry with id ${docketEntryId} on case ${updatedSubjectCaseEntity?.docketNumber}`,
        );
      }

      // Prepend the cover sheet via qpdf and replicate the docket-entry
      // COMPLETE/numberOfPages upserts that addCoversheetInteractor does on
      // the pdf-lib path. We bypass addCoversheetInteractor entirely here so
      // its pdf-lib code doesn't run on this hot path; other callers
      // (paper filing, court-issued, etc.) keep using addCoversheetInteractor
      // unchanged.
      const { withCoverPath } = await prependCoversheetWithQpdfAndPersist({
        applicationContext,
        authorizedUser,
        caseEntity: updatedSubjectCaseEntity!,
        docketEntryEntity: new DocketEntry(updatedSubjectDocketEntry, {
          authorizedUser,
        }),
        documentStorageId,
        originalPdfPath,
        workDir,
      });

      paperServiceResult = await runPaperServiceWithQpdf({
        applicationContext,
        caseEntities,
        docketEntryId,
        withCoverPath,
        workDir,
      });
    } finally {
      await updateDocketEntryPendingServiceStatus({
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
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
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
