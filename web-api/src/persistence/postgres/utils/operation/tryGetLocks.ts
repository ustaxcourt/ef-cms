import { Database } from '@web-api/persistence/postgres/database-schema';
import { hashLockId } from '@web-api/persistence/postgres/utils/mutex';
import { CompiledQuery, ConnectionBuilder } from 'kysely';

// Danger: never use this outside of acquireLock. This should only be used with a specific scoped db connection which is immediately destroyed after being used

export const tryGetLocks = async ({
  connection,
  identifiers,
}: {
  connection: ConnectionBuilder<Database>;
  identifiers: string[];
}): Promise<{ identifier: string; successfullyLocked: boolean }[]> => {
  const hashedIdentifiers = identifiers.map(hashLockId);

  const idMap = new Map(hashedIdentifiers.map((h, i) => [h, identifiers[i]]));

  const sql = `SELECT id, pg_try_advisory_lock(id) AS locked FROM UNNEST($1::int[]) AS t(id)`;

  const result = await connection.execute(db =>
    db.executeQuery(CompiledQuery.raw(sql, [hashedIdentifiers])),
  );

  return result.rows.map((row: any) => ({
    identifier: idMap.get(row.id)!,
    successfullyLocked: row.locked,
  }));
};

export const tryReleaseLocks = async ({
  connection,
  identifiers,
}: {
  connection: ConnectionBuilder<Database>;
  identifiers: string[];
}): Promise<void> => {
  // Hash each identifier the same way as when locking
  const hashedIdentifiers = identifiers.map(hashLockId);

  // Use UNNEST to call pg_advisory_unlock on each id in one query
  const sql = `
    SELECT id,
           pg_advisory_unlock(id) AS unlocked
      FROM UNNEST($1::int[]) AS t(id)
  `;

  await connection.execute(db =>
    db.executeQuery(CompiledQuery.raw(sql, [hashedIdentifiers])),
  );
};
