import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import { pgInsertInto } from '../utils/operation/pgInsertInto';


export const saveRequestResponse = async ({
  requestId,
  userId,
  responseString,
}: {
  requestId: string;
  userId: string;
  responseString: string;
}) => {
  const nowUnix = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));
  const ttl = nowUnix + 16 * 60;
  await pgInsertInto({
    table: 'dwResponseString',
    values: [
      {
        requestId,
        userId,
        responseString,
        ttl,
      },
    ],
  });
};
