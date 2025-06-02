import { getDbWriter } from '@web-api/database';
import { CompiledQuery } from 'kysely';

export const releaseLock = async (lockId: number) => {
  const releasedLockResult = await getDbWriter({
    table: null,
    cb: async writer => {
      const result = await writer.executeQuery<{ pgAdvisoryUnlock: boolean }>(
        CompiledQuery.raw(`select pg_advisory_unlock(${lockId})`, []),
      );
      return result;
    },
  });
  return releasedLockResult.rows[0].pgAdvisoryUnlock;
};
