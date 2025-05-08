import { getDbReader } from '@web-api/database';
import {
  getCasesByDocketNumbers,
  OmittableCaseFields,
} from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';

export const getConsolidatedCases = async <
  T extends OmittableCaseFields[] = [],
>({
  leadDocketNumber,
  excludeFields,
}: {
  leadDocketNumber: string;
  excludeFields?: T;
}) => {
  const dbCaseData = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .where('leadDocketNumber', '=', leadDocketNumber)
      .select('docketNumber')
      .execute(),
  );

  const docketNumbers = dbCaseData.map(({ docketNumber }) => docketNumber);

  const cases = getCasesByDocketNumbers({
    docketNumbers,
    excludeFields,
  });

  return cases;
};
