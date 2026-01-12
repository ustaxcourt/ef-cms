import { Case } from '@shared/business/entities/cases/Case';
import { getDbReader } from '@web-api/database';
import {
  ALL_OMITTABLE_CASE_FIELDS,
  getCasesByDocketNumbers,
  OmittableCaseFields,
} from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { fromKyselyCase } from '@web-api/persistence/postgres/cases/mapper';

export const getConsolidatedCases = async <
  T extends OmittableCaseFields[] = [],
>({
  leadDocketNumber,
  excludeFields,
}: {
  leadDocketNumber: string;
  excludeFields?: T;
}): Promise<Omit<RawCase, 'consolidatedCases' | T[number]>[]> => {
  // If we only need case metadata, make one query for all of it
  if (
    Array.isArray(excludeFields) &&
    ALL_OMITTABLE_CASE_FIELDS.every(f => excludeFields.includes(f))
  ) {
    const dbCaseData = await getDbReader(reader =>
      reader
        .selectFrom('dwCase')
        .where('leadDocketNumber', '=', leadDocketNumber)
        .selectAll()
        .execute(),
    );
    return dbCaseData.map(c => ({
      ...fromKyselyCase(c),
      docketNumberWithSuffix: Case.getDocketNumberWithSuffix({
        docketNumber: c.docketNumber,
        docketNumberSuffix: c.docketNumberSuffix,
      }),
    })) as unknown as Omit<RawCase, 'consolidatedCases' | T[number]>[];
  }

  // Otherwise, get the docket numbers to fetch fuller data set
  const dbCaseDocketNumbersData = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .where('leadDocketNumber', '=', leadDocketNumber)
      .select('docketNumber')
      .execute(),
  );

  const docketNumbers = dbCaseDocketNumbersData.map(
    ({ docketNumber }) => docketNumber,
  );

  const cases = getCasesByDocketNumbers({
    docketNumbers,
    excludeFields,
  });

  return cases;
};
