import { RawUserCase } from '@shared/business/entities/UserCase';
import { getDbReader } from '@web-api/database';

export const getCasesForUser = async ({
  userId,
}: {
  userId: string;
}): Promise<RawUserCase[]> => {
  return await getDbReader(reader =>
    reader
      .selectFrom('dwUserOnCase as uoc')
      .where('uoc.userId', '=', userId)
      .selectAll('uoc')
      .execute(),
  );
};

export const getDocketNumbersByUser = async ({
  userId,
}: {
  userId: string;
}): Promise<string[]> => {
  const cases = await getCasesForUser({
    userId,
  });
  return cases.map(c => c.docketNumber);
};
