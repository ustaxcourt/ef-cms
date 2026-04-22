import { getDbReader } from '@web-api/persistence/postgres/database';
import { ConnectionKysely } from '@web-api/persistence/postgres/connections/schema';

export const getWebSocketConnectionsByUserId = async (
  userId: string,
): Promise<ConnectionKysely[]> =>
  await getDbReader(reader =>
    reader
      .selectFrom('dwConnection')
      .where('userId', '=', userId)
      .selectAll()
      .execute(),
  );
