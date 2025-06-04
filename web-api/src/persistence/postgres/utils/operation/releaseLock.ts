import { Database } from '@web-api/database-schema';
import { CompiledQuery, Kysely } from 'kysely';

export const releaseLock = async (
  db: Kysely<Database>,
  hashedLockId: number,
): Promise<boolean> => {
  const result = await db.executeQuery<{ pgAdvisoryUnlock: boolean }>(
    CompiledQuery.raw('SELECT pg_advisory_unlock($1) AS "pgAdvisoryUnlock"', [
      hashedLockId,
    ]),
  );
  return result.rows[0].pgAdvisoryUnlock;
};
