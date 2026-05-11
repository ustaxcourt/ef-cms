import { DOCUMENT_PROCESSING_STATUS_OPTIONS } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { addCoversheetInteractor } from '@web-api/business/useCases/addCoversheetInteractor';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { getDocketEntriesByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId';
import { updateDocketEntryProcessingStatus } from '@web-api/persistence/postgres/docketEntries/updateDocketEntryProcessingStatus';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';

type AddCoversheetWorkerInput = {
  docketEntryId: string;
  docketNumber: string;
};

export const addCoversheetWorkerHandler = async (
  applicationContext: ServerApplicationContext,
  { docketEntryId, docketNumber }: AddCoversheetWorkerInput,
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  const [docketEntry] = await getDocketEntriesByDocketNumberAndDocketEntryId({
    docketNumbersAndIds: [{ docketEntryId, docketNumber }],
  });

  if (!docketEntry) {
    getDawsonLogger().warn(
      `addCoversheetWorker: docket entry ${docketEntryId} on case ${docketNumber} not found — skipping`,
    );
    return;
  }

  if (
    docketEntry.processingStatus === DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE
  ) {
    getDawsonLogger().info(
      `addCoversheetWorker: docket entry ${docketEntryId} already complete — skipping duplicate SQS delivery`,
    );
    return;
  }

  try {
    await addCoversheetInteractor(
      applicationContext,
      { bypassIdempotencyGate: false, docketEntryId, docketNumber },
      authorizedUser,
    );
  } catch (err) {
    // Write a terminal status so the client poll can stop fast, then
    // rethrow so SQS records the failure: that lets the message land in
    // the DLQ (current maxReceiveCount=1) and triggers the worker_dl_queue
    // CloudWatch alarm. If maxReceiveCount is ever raised, we'll want to
    // hold off on writing ERROR_ADDING_COVERSHEET until the final attempt
    // so a successful retry can still flip the row to COMPLETE.
    getDawsonLogger().error(
      `addCoversheetWorker: coversheet generation failed for docket entry ${docketEntryId} on case ${docketNumber}`,
      { err },
    );
    await updateDocketEntryProcessingStatus({
      docketEntryId,
      docketNumber,
      processingStatus:
        DOCUMENT_PROCESSING_STATUS_OPTIONS.ERROR_ADDING_COVERSHEET,
    });
    throw err;
  }
};

export const addCoversheetWorker = withLocking(
  addCoversheetWorkerHandler,
  (_applicationContext, { docketEntryId }: AddCoversheetWorkerInput) => ({
    identifiers: [`docket-entry|${docketEntryId}`],
  }),
);
