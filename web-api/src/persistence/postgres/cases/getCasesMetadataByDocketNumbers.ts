import { transformDBCaseToEntity } from '@web-api/persistence/postgres/cases/mapper';
import { getDbReader } from '@web-api/database';
import { isEmpty } from 'lodash';
import { Case } from '@shared/business/entities/cases/Case';

export const getCasesMetadataByDocketNumbers = async ({
  docketNumbers,
}: {
  docketNumbers: string[];
}): Promise<
  | Omit<
      RawCase,
      'consolidatedCases' | 'correspondence' | 'docketEntries' | 'petitioners'
    >[]
  | undefined
> => {
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

  return dbCases?.map(c => ({
    ...transformDBCaseToEntity(c),
    docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
      docketNumber: c.docketNumber,
      docketNumberSuffix: c.docketNumberSuffix,
    }),
  }));
};
