import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

const TIME_TO_EXIST = 60 * 60 * 24;

export const saveUserConnection = async ({
  clientConnectionId,
  connectionId,
  endpoint,
  userId,
}: {
  clientConnectionId: string;
  connectionId: string;
  endpoint: string;
  userId: string;
}) => {
  const TTL = Math.floor(Date.now() / 1000) + TIME_TO_EXIST;
  await pgInsertInto({
    table: 'dwConnection',
    values: [
      {
        clientConnectionId,
        connectionId,
        endpoint,
        userId,
        ttl: TTL,
      },
    ],
  });
};
