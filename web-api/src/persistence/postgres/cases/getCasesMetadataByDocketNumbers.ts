import { convertDbRowToRawCase } from '@web-api/persistence/postgres/cases/mapper';
import { getDbReader } from '@web-api/database';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const getCasesMetadataByDocketNumbers = async ({
  docketNumbers,
}: {
  docketNumbers: string[];
}): Promise<RawCase[] | undefined> => {
  const dbCases = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .where('docketNumber', 'in', docketNumbers)
      .selectAll()
      .execute(),
  );

  return dbCases
    ? dbCases.map(c => transformNullToUndefined(convertDbRowToRawCase(c)))
    : undefined;
};
