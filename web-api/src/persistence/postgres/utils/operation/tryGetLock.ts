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
  const idMap = new Map(hashedIdentifiers.map((h, i) => [h, identifiers[i]]));

  const sql = hashedIdentifiers
    .map(val => `SELECT ${val} as id, pg_try_advisory_lock(${val}) as locked`)
    .join(' UNION ALL ');

  const result = await db.executeQuery(CompiledQuery.raw(sql));

  return result.rows.map((row: any) => ({
    identifier: idMap.get(row.id)!,
    successfullyLocked: row.locked,
  }));
};
