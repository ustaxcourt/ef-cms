import { getDbReader } from '@web-api/database';

export const getDispatchNotification = async (topic: string) => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwNotification')
      .where('topic', '=', topic)
      .where('ttl', '>=', Date.now() / 1000)
      .execute(),
  );
};
