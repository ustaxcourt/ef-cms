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
  const hashedIdentifiers = identifiers.map(hashLockId);

  const idMap = new Map(hashedIdentifiers.map((h, i) => [h, identifiers[i]]));

  const sql = `SELECT id, pg_try_advisory_lock(id) AS locked FROM UNNEST($1::int[]) AS t(id)`;

  const result = await db.executeQuery(
    CompiledQuery.raw(sql, [hashedIdentifiers]),
  );

  return result.rows.map((row: any) => ({
    identifier: idMap.get(row.id)!,
    successfullyLocked: row.locked,
  }));
};
