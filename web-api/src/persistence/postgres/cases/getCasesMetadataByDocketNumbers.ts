import { rawCaseEntity } from '@web-api/persistence/postgres/cases/mapper';
import { getDbReader } from '@web-api/database';
import { isEmpty } from 'lodash';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const getCasesMetadataByDocketNumbers = async ({
  docketNumbers,
}: {
  docketNumbers: string[];
}): Promise<RawCase[] | undefined> => {
  if (isEmpty(docketNumbers)) {
    return [];
  }

  const dbCases = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .where('docketNumber', 'in', docketNumbers)
      .selectAll()
      .execute(),
  );

  return dbCases?.map(c => transformNullToUndefined(rawCaseEntity(c)));
};
