import { Case } from '@shared/business/entities/cases/Case';
import {
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  SIMULTANEOUS_DOCUMENT_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { addCoverToPdf } from './addCoverToPdf';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { upsertDocketEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { NotFoundError } from '@web-api/errors/errors';
import { DocketEntry } from '@shared/business/entities/DocketEntry';

export const addCoversheetInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    bypassIdempotencyGate = false,
    caseEntity,
    docketEntryId,
    docketNumber,
    filingDateUpdated = false,
    replaceCoversheet = false,
    useInitialData = false,
  }: {
    // Bypass the COMPLETE-status idempotency gate. Sync callers that
    // unconditionally want a regeneration (e.g. updateDocketEntryMeta on
    // metadata edits) set this; queued/retry callers leave it false so a
    // duplicate delivery or post-S3 retry doesn't stack a second coversheet.
    bypassIdempotencyGate?: boolean;
    caseEntity?: Case;
    docketEntryId: string;
    docketNumber: string;
    // Cover-page content selection: if true, the cover page reflects an
    // updated filing date / received date. Independent of the gate.
    filingDateUpdated?: boolean;
    // Cover-page content selection: if true, the existing first page is
    // dropped and replaced with the regenerated cover. Independent of the
    // gate — callers that also want to regenerate a COMPLETE entry must
    // additionally pass bypassIdempotencyGate.
    replaceCoversheet?: boolean;
    useInitialData?: boolean;
  },
  authorizedUser: UnknownAuthUser,
) => {
  if (!caseEntity) {
    const caseRecord = await getCaseByDocketNumber({
      docketNumber,
    });

    caseEntity = new Case(caseRecord, {
      authorizedUser,
    });
  }
  const docketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!docketEntryEntity) {
    throw new NotFoundError(
      `Could not find docket entry with id ${docketEntryId} on case ${docketNumber}`,
    );
  }

  // Idempotency gate: a COMPLETE entry has already had its coversheet
  // prepended by a prior run of this interactor. Re-running would stack a
  // second coversheet on the S3 object — which matters on the queued path
  // (duplicate SQS delivery) and on retrySettled callers like serveCaseToIrs
  // that re-invoke after a partial failure. Sync callers that intend to
  // regenerate (updateDocketEntryMeta) set bypassIdempotencyGate to opt out.
  if (
    docketEntryEntity.processingStatus ===
      DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE &&
    !bypassIdempotencyGate
  ) {
    return new DocketEntry(docketEntryEntity, { authorizedUser })
      .validate()
      .toRawObject();
  }

  const pdfData = await applicationContext.getPersistenceGateway().getDocument({
    applicationContext,
    key: docketEntryEntity.documentStorageId,
  });

  const {
    consolidatedCases, // if feature flag is off, this will always be null
    numberOfPages,
    pdfData: newPdfData,
  } = await addCoverToPdf({
    applicationContext,
    caseEntity,
    docketEntryEntity,
    filingDateUpdated,
    pdfData,
    replaceCoversheet,
    useInitialData,
  });

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    document: newPdfData,
    key: docketEntryEntity.documentStorageId,
  });

  let docketNumbersToUpdate = [docketNumber];

  if (consolidatedCases) {
    docketNumbersToUpdate = consolidatedCases
      .filter(consolidatedCase => consolidatedCase.documentNumber)
      .map(({ docketNumber: caseDocketNumber }) => caseDocketNumber);
  }

  const casesToUpdate = await getCasesByDocketNumbers({
    docketNumbers: docketNumbersToUpdate,
  });

  const updatedDocketEntries = casesToUpdate
    .map(caseRecord => {
      const consolidatedCaseEntity: Case =
        caseRecord.docketNumber === docketNumber && caseEntity
          ? caseEntity
          : new Case(caseRecord, {
              authorizedUser,
            });

      const consolidatedCaseDocketEntry =
        consolidatedCaseEntity.getDocketEntryById({
          docketEntryId,
        });

      if (consolidatedCaseDocketEntry) {
        const isSimultaneousDocType =
          SIMULTANEOUS_DOCUMENT_EVENT_CODES.includes(
            consolidatedCaseDocketEntry.eventCode,
          ) ||
          consolidatedCaseDocketEntry.documentTitle?.includes('Simultaneous');

        const consolidatedCaseDocketEntryEntity = new DocketEntry(
          consolidatedCaseDocketEntry,
          { authorizedUser },
        );

        if (
          !isSimultaneousDocType ||
          (isSimultaneousDocType &&
            caseEntity &&
            caseRecord.docketNumber === docketNumber)
        ) {
          consolidatedCaseDocketEntryEntity.setAsProcessingStatusAsCompleted();
        }

        consolidatedCaseDocketEntryEntity.setNumberOfPages(numberOfPages);

        const updateConsolidatedDocketEntry = consolidatedCaseDocketEntryEntity
          .validate()
          .toRawObject();

        return updateConsolidatedDocketEntry;
      }
    })
    .filter(docketEntry => docketEntry !== undefined);

  await upsertDocketEntries(updatedDocketEntries);

  return updatedDocketEntries.find(
    entry => entry.docketNumber === docketNumber,
  );
};
