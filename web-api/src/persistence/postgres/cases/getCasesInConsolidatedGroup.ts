import { Case } from '@shared/business/entities/cases/Case';
import { getDbReader } from '@web-api/database';
import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';

export const getCasesInConsolidatedGroup = async ({
  leadDocketNumber,
}: {
  leadDocketNumber: string;
}): Promise<
  Omit<
    RawCase,
    'consolidatedCases' | 'correspondence' | 'docketEntries' | 'petitioners'
  >[]
> => {
  const result = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .where('leadDocketNumber', '=', leadDocketNumber)
      .selectAll()
      .execute(),
  );

  return result.map(c => ({
    ...fromKyselyCase(c),
    docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
      docketNumber: c.docketNumber,
      docketNumberSuffix: c.docketNumberSuffix,
    }),
  }));
};
