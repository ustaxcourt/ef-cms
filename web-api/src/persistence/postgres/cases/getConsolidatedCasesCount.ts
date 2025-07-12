import { getDbReader } from '@web-api/persistence/postgres/database';

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

  return Number(countResult?.count ?? 0);
};
