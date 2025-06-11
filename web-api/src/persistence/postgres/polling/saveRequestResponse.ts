import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import { pgInsertInto } from '../utils/operation/pgInsertInto';

/**
 * Saves a request response chunk to postgres
 */
export const saveRequestResponse = async ({
  requestId,
  userId,
  chunk,
  index,
  totalNumberOfChunks,
}: {
  requestId: string;
  userId: string;
  chunk: string;
  index: number;
  totalNumberOfChunks: number;
}) => {
  const nowUnix = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));
  const ttl = nowUnix + 16 * 60;
  await pgInsertInto({
    table: 'dwResponseChunk',
    values: [
      {
        requestId,
        userId,
        chunk,
        index,
        totalNumberOfChunks,
        ttl,
      },
    ],
  });
};
