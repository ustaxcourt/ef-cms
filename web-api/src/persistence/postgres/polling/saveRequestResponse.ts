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
  const expiresAt = new Date(Date.now() + 16 * 60 * 1000);

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
          createdAt: new Date(),
          expiresAt,
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
          expiresAt,
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
        createdAt: new Date(),
        expiresAt,
      },
    ],
    onConflictColumns: ['userId', 'requestId', 'index'],
  });
};
