import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

const TIME_TO_EXIST_IN_SECONDS = 300;

export const saveDispatchNotification = async (topic: string) => {
  const TTL = Math.floor(Date.now() / 1000) + TIME_TO_EXIST_IN_SECONDS;
  await pgInsertInto({
    table: 'dwNotification',
    values: [
      {
        topic,
        ttl: TTL,
      },
    ],
  });
};
