import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { DOCUMENT_PROCESSING_STATUS_OPTIONS } from '@shared/business/entities/EntityConstants';
import { MESSAGE_TYPES } from '@web-api/gateways/worker/workerRouter';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { updateDocketEntryProcessingStatus } from '@web-api/persistence/postgres/docketEntries/updateDocketEntryProcessingStatus';

// Callers must pass an already-authenticated user. The worker forwards this
// onward to addCoversheetInteractor (which needs it to build Case entities
// and scope persistence) — the SQS message has no other way to acquire one.
export const enqueueAddCoversheet = async (
  applicationContext: ServerApplicationContext,
  {
    authorizedUser,
    docketEntryId,
    docketNumber,
  }: {
    authorizedUser: AuthUser;
    docketEntryId: string;
    docketNumber: string;
  },
): Promise<void> => {
  // Mark the entry pending synchronously here (rather than in the worker) so
  // pollForCoversheetComplete on the caller can't observe a stale COMPLETE
  // status from a prior version of the entry between the lambda response and
  // the worker picking up the SQS message.
  await updateDocketEntryProcessingStatus({
    docketEntryId,
    docketNumber,
    processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
  });

  try {
    await applicationContext.getWorkerGateway().queueWork(applicationContext, {
      message: {
        authorizedUser,
        payload: { docketEntryId, docketNumber },
        type: MESSAGE_TYPES.ADD_COVERSHEET,
      },
    });
  } catch (err) {
    // The PENDING write above already landed; if we leave it, the client
    // poll waits the full timeout for a worker that will never run. Flip
    // to ERROR_ADDING_COVERSHEET so the poll fails fast with a definitive
    // terminal state, then rethrow so the caller's response also fails.
    await updateDocketEntryProcessingStatus({
      docketEntryId,
      docketNumber,
      processingStatus:
        DOCUMENT_PROCESSING_STATUS_OPTIONS.ERROR_ADDING_COVERSHEET,
    });
    throw err;
  }
};
