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
  applicationContext: IApplicationContext;
  requestId: string;
  userId: string;
  chunk: string;
  index: number;
  totalNumberOfChunks: number;
}) => {
  // Calculate expiration time (16 minutes from now, matching dynamo TTL)
  const nowUnix = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));
  const ttl = nowUnix + 16 * 60;
  // If this is the first chunk, create/update the request record
  if (index === 0) {
    await pgInsertInto({
      table: 'dwRequest',
      values: [
        {
          requestId,
          userId,
          status: totalNumberOfChunks === 1 ? 'complete' : 'processing',
          totalChunks: totalNumberOfChunks,
          ttl,
        },
      ],
      onConflictColumns: ['userId', 'requestId'],
    });
  }
  // If this is the last chunk, mark the request as complete
  else if (index === totalNumberOfChunks - 1) {
    // For updates, we'd typically use a dedicated update function
    // But we can reuse pgInsertInto with conflict handling
    await pgInsertInto({
      table: 'dwRequest',
      values: [
        {
          requestId,
          userId,
          status: 'complete',
          ttl,
        },
      ],
      onConflictColumns: ['userId', 'requestId'],
    });
  }

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
