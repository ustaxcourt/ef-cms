import { getDbReader } from '@web-api/persistence/postgres/getDbWriter';
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
  applicationContext: IApplicationContext;
  requestId: string;
  userId: string;
}): Promise<ResponseChunk[]> => {

  // get results from the database
  const results = await getDbReader(async (reader) => {
    // Retrieve chunks
    return await reader
      .selectFrom('response_chunks')
      .select(['chunk', 'index', 'requestId', 'totalNumberOfChunks'])
      .where('userId', '=', userId)
      .where('requestId', '=', requestId)
      .orderBy('index', 'asc')
      .execute();
  });
  
  return results;
};