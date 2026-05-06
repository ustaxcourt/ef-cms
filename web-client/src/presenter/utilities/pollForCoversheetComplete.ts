import { ClientApplicationContext } from '@web-client/applicationContext';
import { DOCUMENT_PROCESSING_STATUS_OPTIONS } from '@shared/business/entities/EntityConstants';
import { getCurrentDateTimeInMillis } from '@shared/business/utilities/DateHandler';

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

export class CoversheetGenerationError extends Error {
  public readonly failedDocketEntryIds: string[];
  constructor(failedDocketEntryIds: string[]) {
    super(
      `Coversheet generation failed for: ${failedDocketEntryIds.join(', ')}`,
    );
    this.name = 'CoversheetGenerationError';
    this.failedDocketEntryIds = failedDocketEntryIds;
  }
}

// First ~25s polled at 2.5s, then back off to 5s. Jitter of up to 500ms is
// added to each wait to avoid thundering-herd when many tabs poll in parallel.
const FAST_INTERVAL_MS = 2500;
const SLOW_INTERVAL_MS = 5000;
const FAST_ATTEMPT_LIMIT = 10;
const JITTER_MS = 500;

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

  const deadline = getCurrentDateTimeInMillis() + expirationSeconds * 1000;
  const { sleep } = applicationContext.getUtilities();

  let attempt = 0;
  while (pending.size > 0) {
    if (getCurrentDateTimeInMillis() > deadline) {
      throw new CoversheetPollTimeoutError([...pending]);
    }

    const baseWaitMs =
      attempt < FAST_ATTEMPT_LIMIT ? FAST_INTERVAL_MS : SLOW_INTERVAL_MS;
    const waitMs = baseWaitMs + Math.floor(Math.random() * JITTER_MS);
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

    const failed = results
      .filter(
        r =>
          r.processingStatus ===
          DOCUMENT_PROCESSING_STATUS_OPTIONS.ERROR_ADDING_COVERSHEET,
      )
      .map(r => r.docketEntryId);
    if (failed.length > 0) {
      throw new CoversheetGenerationError(failed);
    }

    for (const { docketEntryId, processingStatus } of results) {
      if (processingStatus === DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE) {
        pending.delete(docketEntryId);
      }
    }
  }
};
