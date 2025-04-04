import { getDbReader } from '@web-api/database';
import { Connection } from '@web-api/notifications/sendNotificationToConnection';

export const getAllWebSocketConnections = async (): Promise<Connection[]> =>
  await getDbReader(reader =>
    reader.selectFrom('dwConnection').selectAll().execute(),
  );
