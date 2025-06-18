import { getDbReader } from '@web-api/database';
import { Connection } from '@web-api/notifications/sendNotificationToConnection';

export const getWebSocketConnectionsByUserId = async (
  userId: string,
): Promise<Connection[]> =>
  await getDbReader(reader =>
    reader
      .selectFrom('dwConnection')
      .where('userId', '=', userId)
      .selectAll()
      .execute(),
  );
