import { formatNow, FORMATS } from '@shared/business/utilities/DateHandler';
import { pgInsertInto } from '../utils/operation/pgInsertInto';

// TODO: move this to a shared location

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
  // Calculate expiration time (16 minutes from now, matching dynamo TTL)
  const nowUnix = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));
  const ttl = nowUnix + 16 * 60;
  // Save this chunk
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
    onConflictColumns: ['userId', 'requestId', 'index'],
  });
};
