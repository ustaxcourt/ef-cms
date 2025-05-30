import { getDbReader } from '@web-api/database';

export const getCaseExists = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<boolean> => {
  const dbCase = await getDbReader(reader =>
    reader
      .selectFrom('dwCase as c')
      .select('docketNumber')
      .where('c.docketNumber', '=', docketNumber)
      .executeTakeFirst(),
  );

  return !!dbCase?.docketNumber;
};
