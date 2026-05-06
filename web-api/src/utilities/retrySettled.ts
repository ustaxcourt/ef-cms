import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';

type RetrySettledOptions<TItem> = {
  maxAttempts?: number;
  // Delay applied before each retry (attempts 2..maxAttempts). Defaults to
  // a small exponential backoff so a transient S3 / PDF-generation failure
  // isn't hammered three times back-to-back in the same millisecond.
  retryDelayMs?: (attempt: number) => number;
  onFailure?: (params: {
    attempt: number;
    error: unknown;
    item: TItem;
    willRetry: boolean;
  }) => void;
};

const defaultRetryDelayMs = (attempt: number): number => {
  // Attempt 2 → ~250ms, attempt 3 → ~500ms, plus up to 100ms jitter to
  // avoid lockstep retries when many items fail in the same wave.
  const base = 125 * 2 ** (attempt - 1);
  return base + Math.floor(Math.random() * 100);
};

const wait = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

// Runs `fn` for every item in parallel via Promise.allSettled, then retries
// only the rejected items on the next attempt. Returns results in the same
// order as `items`. Throws the last rejection if any item is still failing
// after `maxAttempts`. Useful when partial failure should be retried without
// re-doing the work that already succeeded.
export const retrySettled = async <TItem, TResult>(
  items: readonly TItem[],
  fn: (item: TItem, attempt: number) => Promise<TResult>,
  {
    maxAttempts = 3,
    onFailure,
    retryDelayMs = defaultRetryDelayMs,
  }: RetrySettledOptions<TItem> = {},
): Promise<TResult[]> => {
  const results = new Array<TResult>(items.length);
  let pendingIndices = items.map((_, i) => i);
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (attempt > 1) {
      await wait(retryDelayMs(attempt));
    }
    const settled = await Promise.allSettled(
      pendingIndices.map(i => fn(items[i], attempt)),
    );

    const failedIndices: number[] = [];

    settled.forEach((result, k) => {
      const originalIndex = pendingIndices[k];
      if (result.status === 'fulfilled') {
        results[originalIndex] = result.value;
        return;
      }
      lastError = result.reason;
      failedIndices.push(originalIndex);
      const willRetry = attempt < maxAttempts;
      if (onFailure) {
        onFailure({
          attempt,
          error: result.reason,
          item: items[originalIndex],
          willRetry,
        });
      } else {
        getDawsonLogger().error(result.reason);
      }
    });

    if (failedIndices.length === 0) {
      return results;
    }

    pendingIndices = failedIndices;
  }

  throw lastError;
};
