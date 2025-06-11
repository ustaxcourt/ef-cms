import { getDbReader } from '@web-api/database';
export type ResponseChunk = {
  chunk: string;
  index: number;
  requestId: string;
  totalNumberOfChunks: number;
};

export const getRequestResults = async ({
  requestId,
  userId,
}: {
  requestId: string;
  userId: string;
}): Promise<ResponseChunk[]> => {
  const results = await getDbReader(async reader => {
    return await reader
      .selectFrom('dwResponseChunk')
      .select(['chunk', 'index', 'requestId', 'totalNumberOfChunks', 'userId'])
      .where('userId', '=', userId)
      .where('requestId', '=', requestId)
      .orderBy('index', 'asc')
      .execute();
  });

  return results;
};
