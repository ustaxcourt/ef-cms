import { getDbReader } from '@web-api/persistence/postgres/database';

export const getDispatchNotification = async (topic: string) => {
  const TTL = Math.floor(Date.now() / 1000);
  return await getDbReader(reader =>
    reader
      .selectFrom('dwNotification')
      .where('topic', '=', topic)
      .where('ttl', '>=', TTL)
      .execute(),
  );
};
