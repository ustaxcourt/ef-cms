import { getDbReader } from '@web-api/database';
import { rawCaseEntity } from '@web-api/persistence/postgres/cases/mapper';

export const getCasesInConsolidatedGroup = async ({
  leadDocketNumber,
}: {
  leadDocketNumber: string;
}): Promise<RawCase[]> => {
  const result = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .where('leadDocketNumber', '=', leadDocketNumber)
      .selectAll()
      .execute(),
  );

  return result.map(c => rawCaseEntity(c));
};
