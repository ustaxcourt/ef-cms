import { formatNow } from '@shared/business/utilities/DateHandler';
import { pgInsertInto } from '../utils/operation/pgInsertInto';
import { NewRequestKysely, NewResponseChunkKysely } from './schema';

export const saveRequestResponse = async ({
  /* eslint-disable @typescript-eslint/no-unused-vars */
  applicationContext,
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
  const nowUnix = Number(formatNow('UNIX_TIMESTAMP_SECONDS'));
  const ttl = nowUnix + 16 * 60;

  // If this is the first chunk, create/update the request record
  if (index === 0) {
    const requestRecord: NewRequestKysely = {
      requestId,
      userId,
      status: totalNumberOfChunks === 1 ? 'complete' : 'processing',
      totalChunks: totalNumberOfChunks,
      ttl,
    };
    await pgInsertInto({
      table: 'dwRequest',
      values: [requestRecord],
      onConflictColumns: ['userId', 'requestId'],
    });
  }
  // If this is the last chunk, mark the request as complete
  else if (index === totalNumberOfChunks - 1) {
    const requestUpdate: NewRequestKysely = {
      requestId,
      userId,
      status: 'complete',
      ttl,
    };

    await pgInsertInto({
      table: 'dwRequest',
      values: [requestUpdate],
      onConflictColumns: ['userId', 'requestId'],
    });
  }

  const chunkRecord: NewResponseChunkKysely = {
    requestId,
    userId,
    chunk,
    index,
    totalNumberOfChunks,
    ttl,
  };

  // Save this chunk
  await pgInsertInto({
    table: 'dwResponseChunk',
    values: [chunkRecord],
    onConflictColumns: ['userId', 'requestId', 'index'],
  });
};
