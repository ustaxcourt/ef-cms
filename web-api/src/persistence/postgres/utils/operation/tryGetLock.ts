import { Database } from '@web-api/database-schema';
import { CompiledQuery, Kysely } from 'kysely';

export const tryGetLock = async (
  db: Kysely<Database>,
  hashedLockId: number,
): Promise<boolean> => {
  const result = await db.executeQuery<{ pgTryAdvisoryLock: boolean }>(
    CompiledQuery.raw(
      'SELECT pg_try_advisory_lock($1) AS "pgTryAdvisoryLock"',
      [hashedLockId],
    ),
  );
  return result.rows[0].pgTryAdvisoryLock;
};
