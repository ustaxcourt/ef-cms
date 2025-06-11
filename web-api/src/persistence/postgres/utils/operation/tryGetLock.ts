import { Database } from '@web-api/database-schema';
import { hashLockId } from '@web-api/persistence/postgres/utils/mutex';
import { CompiledQuery, Kysely } from 'kysely';

// Danger: never use this outside of acquireLock. This should only be used with a specific scoped db connection which is immediately destroyed after being used
export const tryGetLocks = async ({
  db,
  identifiers,
}: {
  db: Kysely<Database>;
  identifiers: string[];
}): Promise<{ identifier: string; successfullyLocked: boolean }[]> => {
  const hashedIdentifiers = identifiers.map(id => hashLockId(id));
  const placeholders = hashedIdentifiers.map((_, i) => `$${i + 1}`).join(', ');
  const sql = `SELECT ${placeholders
    .split(', ')
    .map(ph => `pg_try_advisory_lock(${ph})`)
    .join(', ')}`;
  const rawQuery = CompiledQuery.raw(sql, hashedIdentifiers);
  const result = await db.executeQuery(rawQuery);
  const success: { identifier: string; successfullyLocked: boolean }[] =
    result.rows.map((row: any, i) => ({
      successfullyLocked: row.pg_try_advisory_lock,
      identifier: identifiers[i],
    }));

  return success;
};
