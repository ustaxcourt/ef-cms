import { getDbReader } from '@web-api/database';
export type ResponseString = {
  responseString: string;
  requestId: string;
  userId: string;
};

export const getRequestResults = async ({
  requestId,
  userId,
}: {
  requestId: string;
  userId: string;
}): Promise<ResponseString | undefined> => {
  const result = await getDbReader(async reader => {
    return await reader
      .selectFrom('dwResponseString')
      .select(['requestId', 'responseString', 'userId'])
      .where('userId', '=', userId)
      .where('requestId', '=', requestId)
      .executeTakeFirst();
  });

  return result;
};
