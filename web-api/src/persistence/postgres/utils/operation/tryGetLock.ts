import { getDbWriter } from '@web-api/database';
import { CompiledQuery } from 'kysely';

export const tryGetLock = async (lockId: number) => {
  const gotLockResult = await getDbWriter({
    table: null,
    cb: async writer => {
      const result = await writer.executeQuery<{ pgTryAdvisoryLock: boolean }>(
        CompiledQuery.raw(`select pg_try_advisory_lock(${lockId})`, []),
      );
      return result;
    },
  });
  return gotLockResult.rows[0].pgTryAdvisoryLock;
};
