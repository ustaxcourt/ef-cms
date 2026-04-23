import { ClientApplicationContext } from '@web-client/applicationContext';
import { DOCUMENT_PROCESSING_STATUS_OPTIONS } from '@shared/business/entities/EntityConstants';

export class CoversheetPollTimeoutError extends Error {
  public readonly pendingDocketEntryIds: string[];
  constructor(pendingDocketEntryIds: string[]) {
    super(
      `Coversheet generation did not complete in time for: ${pendingDocketEntryIds.join(', ')}`,
    );
    this.name = 'CoversheetPollTimeoutError';
    this.pendingDocketEntryIds = pendingDocketEntryIds;
  }
}

const FAST_INTERVAL_MS = 1500;
const SLOW_INTERVAL_MS = 5000;
const FAST_ATTEMPT_LIMIT = 10;

export const pollForCoversheetComplete = async ({
  applicationContext,
  docketEntryIds,
  docketNumber,
  expirationSeconds = 300,
}: {
  applicationContext: ClientApplicationContext;
  docketEntryIds: string[];
  docketNumber: string;
  expirationSeconds?: number;
}): Promise<void> => {
  const pending = new Set(docketEntryIds);
  if (pending.size === 0) return;

  const deadline = Date.now() + expirationSeconds * 1000;
  const sleep = applicationContext.getUtilities().sleep;

  let attempt = 0;
  while (pending.size > 0) {
    if (Date.now() > deadline) {
      throw new CoversheetPollTimeoutError([...pending]);
    }

    const waitMs =
      attempt < FAST_ATTEMPT_LIMIT ? FAST_INTERVAL_MS : SLOW_INTERVAL_MS;
    await sleep(waitMs);
    attempt += 1;

    const checks = [...pending].map(async docketEntryId => {
      const { processingStatus } = await applicationContext
        .getUseCases()
        .getDocketEntryProcessingStatusInteractor(applicationContext, {
          docketEntryId,
          docketNumber,
        });
      return { docketEntryId, processingStatus };
    });

    const results = await Promise.all(checks);
    for (const { docketEntryId, processingStatus } of results) {
      if (processingStatus === DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE) {
        pending.delete(docketEntryId);
      }
    }
  }
};
