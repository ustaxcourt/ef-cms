import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import { pgInsertInto } from '../utils/operation/pgInsertInto';

const SIXTEEN_MINUTES = 16 * 60;

const getTtl = (ttl?: number): number => {
  return (
    ttl ?? Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS)) + SIXTEEN_MINUTES
  );
};

export const saveRequestResponse = async ({
  requestId,
  userId,
  responseString,
}: {
  requestId: string;
  userId: string;
  responseString: string;
}) => {

  const ttl = getTtl();
  
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
