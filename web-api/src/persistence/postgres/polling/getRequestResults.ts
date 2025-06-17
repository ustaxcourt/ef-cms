import { getDbReader } from '@web-api/database';
export type ResponseChunk = {
  responseString: string;
  requestId: string;
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
      .selectFrom('dwResponseString')
      .select(['requestId', 'responseString', 'userId'])
      .where('userId', '=', userId)
      .where('requestId', '=', requestId)
      .execute();
  });
  console.log('Results from getRequestResults!!!!!!:', results);
  console.log(
    `getRequestResults: requestId=${requestId}, userId=${userId}, results.length=${results.length}`,
  );

  console.log(`getRequestResults: results=${JSON.stringify(results)}`);

  return results;
};
