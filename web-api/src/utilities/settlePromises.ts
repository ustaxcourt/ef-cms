import { getLogger } from '@web-api/utilities/logger/getLogger';

export async function settlePromises<T extends readonly unknown[]>(
  promises: readonly [...T],
  { errorMessage }: { errorMessage?: string } = {},
): Promise<{ [K in keyof T]: Awaited<T[K]> }> {
  const results = await Promise.allSettled(promises);

  const errors: unknown[] = [];

  results.forEach(result => {
    if (result.status === 'rejected') {
      getLogger().error(result.reason);
      errors.push(result.reason);
    }
  });

  if (errors.length > 0) {
    const errorMessagePrefix = errorMessage ? `${errorMessage}: ` : '';
    throw new Error(
      `${errorMessagePrefix}${errors.length} promises rejected in settlePromises`,
    );
  }
  return results.map(
    result => (result as PromiseFulfilledResult<unknown>).value,
  ) as {
    [K in keyof T]: Awaited<T[K]>;
  };
}
