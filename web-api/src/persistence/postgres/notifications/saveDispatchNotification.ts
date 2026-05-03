import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';
import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';

const TIME_TO_EXIST_IN_SECONDS = 300;

export const saveDispatchNotification = async (topic: string) => {
  const nowSeconds = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));
  const TTL = nowSeconds + TIME_TO_EXIST_IN_SECONDS;
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
