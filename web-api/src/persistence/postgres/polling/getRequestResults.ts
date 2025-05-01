import { Database } from '../database-types';

export type ResponseChunk = {
  chunk: string;
  index: number;
  requestId: string;
  totalNumberOfChunks: number;
};

export const getRequestResults = async ({
  applicationContext,
  requestId,
  userId,
}: {
  applicationContext: IApplicationContext;
  requestId: string;
  userId: string;
}): Promise<ResponseChunk[]> => {
  const { db } = applicationContext.getPersistenceGateway().postgres;
  
  // First, get the results
  const results = await db.transaction().execute(async (trx) => {
    // Retrieve chunks
    const chunks = await trx
      .selectFrom('response_chunks')
      .select(['chunk', 'index', 'requestId', 'totalNumberOfChunks'])
      .where('userId', '=', userId)
      .where('requestId', '=', requestId)
      .orderBy('index', 'asc')
      .execute();
    
    // Delete after retrieving
    if (chunks.length > 0) {
      await trx
        .deleteFrom('response_chunks')
        .where('userId', '=', userId)
        .where('requestId', '=', requestId)
        .execute();
      
      await trx
        .deleteFrom('requests')
        .where('userId', '=', userId)
        .where('requestId', '=', requestId)
        .execute();
    }
    
    return chunks;
  });
  
  return results;
};