import { getDbReader } from '@web-api/database';
import { ConnectionKysely } from '@web-api/persistence/postgres/connections/schema';

export const getAllWebSocketConnections = async (): Promise<
  ConnectionKysely[]
> =>
  await getDbReader(reader =>
    reader.selectFrom('dwConnection').selectAll().execute(),
  );
