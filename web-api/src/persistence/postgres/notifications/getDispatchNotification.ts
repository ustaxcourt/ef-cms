import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import { getDbReader } from '@web-api/database';

export const getDispatchNotification = async (topic: string) => {
  const now = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));
  return await getDbReader(reader =>
    reader
      .selectFrom('dwNotification')
      .where('topic', '=', topic)
      .where('ttl', '>=', now)
      .execute(),
  );
};
