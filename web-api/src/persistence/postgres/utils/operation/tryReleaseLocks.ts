import { Database } from '@web-api/persistence/postgres/database-schema';
import { hashLockId } from '@web-api/persistence/postgres/utils/mutex';
import { CompiledQuery, ConnectionBuilder } from 'kysely';

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
