import { DOCUMENT_PROCESSING_STATUS_OPTIONS } from '@shared/business/entities/EntityConstants';
import { MESSAGE_TYPES } from '@web-api/gateways/worker/workerRouter';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { updateDocketEntryProcessingStatus } from '@web-api/persistence/postgres/docketEntries/updateDocketEntryProcessingStatus';

export const enqueueAddCoversheet = async (
  applicationContext: ServerApplicationContext,
  {
    authorizedUser,
    docketEntryId,
    docketNumber,
  }: {
    authorizedUser: UnknownAuthUser;
    docketEntryId: string;
    docketNumber: string;
  },
): Promise<void> => {
  // Mark the entry as pending so pollForCoversheetComplete won't see a stale
  // COMPLETE status (e.g. carried over from a draft) and exit before the
  // worker has actually attached the coversheet.
  await updateDocketEntryProcessingStatus({
    docketEntryId,
    docketNumber,
    processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.PENDING,
  });

  await applicationContext.getWorkerGateway().queueWork(applicationContext, {
    message: {
      authorizedUser: authorizedUser!,
      payload: { docketEntryId, docketNumber },
      type: MESSAGE_TYPES.ADD_COVERSHEET,
    },
  });
};
