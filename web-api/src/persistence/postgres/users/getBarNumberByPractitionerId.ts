import { getDbReader } from '@web-api/database';

export const getBarNumberByPractitionerId = async ({
  userId,
}: {
  userId: string;
}): Promise<string | undefined> => {
  const result = await getDbReader(reader =>
    reader
      .selectFrom('dwPractitioner')
      .where('userId', '=', userId)
      .select('barNumber')
      .executeTakeFirst(),
  );

  return result?.barNumber;
};
