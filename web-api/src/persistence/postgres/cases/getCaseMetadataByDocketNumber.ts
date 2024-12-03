import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const getCaseMetadataByDocketNumber = async ({
  docketNumber,
}: {
  docketNumber: string;
}): Promise<RawCase | undefined> => {
  const dbCase = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .where('docketNumber', '=', docketNumber)
      .selectAll()
      .executeTakeFirst(),
  );

  return dbCase ? (transformNullToUndefined(dbCase) as RawCase) : undefined;
};
