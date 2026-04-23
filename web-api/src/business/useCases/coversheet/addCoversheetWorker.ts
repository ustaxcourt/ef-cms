import { DOCUMENT_PROCESSING_STATUS_OPTIONS } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { addCoversheetInteractor } from '@web-api/business/useCases/addCoversheetInteractor';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { getDocketEntriesByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId';
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

  await addCoversheetInteractor(
    applicationContext,
    { docketEntryId, docketNumber },
    authorizedUser,
  );
};

export const addCoversheetWorker = withLocking(
  addCoversheetWorkerHandler,
  (_applicationContext, { docketEntryId }: AddCoversheetWorkerInput) => ({
    identifiers: [`docket-entry|${docketEntryId}`],
  }),
);
