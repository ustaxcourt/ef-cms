import { ConnectionBuilder } from 'kysely';
import { Database } from './database-schema';
import { getDb } from '@web-api/persistence/postgres/databaseConnection';

export const acquireOneDbConnection = async (): Promise<
  ConnectionBuilder<Database>
> => {
  const db = await getDb();
  const singleConnection = db.connection();
  return singleConnection;
};
