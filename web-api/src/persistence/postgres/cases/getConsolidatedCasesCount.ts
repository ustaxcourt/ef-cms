import { getDbReader } from '@web-api/database';

export const getConsolidatedCasesCount = async ({
  leadDocketNumber,
}: {
  leadDocketNumber: string;
}): Promise<number> => {
  const countResult = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .where('leadDocketNumber', '=', leadDocketNumber)
      .select(reader.fn.countAll().as('count'))
      .executeTakeFirst(),
  );
  return (countResult?.count as number) || 0;
};
