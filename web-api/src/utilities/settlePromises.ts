import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';

export async function settlePromises<T extends readonly unknown[]>(
  promises: readonly [...T],
): Promise<{ [K in keyof T]: Awaited<T[K]> }> {
  const results = await Promise.allSettled(promises);

  const errors: unknown[] = [];

  results.forEach(result => {
    if (result.status === 'rejected') {
      getDawsonLogger().error(result.reason);
      errors.push(result.reason);
    }
  });

  if (errors.length > 0) {
    throw errors[0];
  }
  return results.map(
    result => (result as PromiseFulfilledResult<unknown>).value,
  ) as {
    [K in keyof T]: Awaited<T[K]>;
  };
}
