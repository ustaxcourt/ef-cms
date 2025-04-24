import { getLogger } from '@web-api/utilities/logger/getLogger';

export async function settlePromises<T>(
  promises: Promise<T>[],
): Promise<Awaited<T>[]> {
  const results = await Promise.allSettled(promises);
  const successes = results.filter(result => result.status === 'fulfilled');
  const failures = results.filter(result => result.status === 'rejected');
  if (failures.length) {
    failures.forEach(failure => getLogger().error(failure.reason));
    throw new Error(`${failures.length} promises rejected in settlePromises`);
  }
  return successes;
}
