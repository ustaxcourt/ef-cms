import { getDbReader } from '@web-api/database';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';

export const getCasesByLeadDocketNumber = async ({
  leadDocketNumber,
}: {
  leadDocketNumber: string;
}): Promise<Omit<RawCase, 'consolidatedCases'>[]> => {
  const dbCaseData = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .where('leadDocketNumber', '=', leadDocketNumber)
      .select('docketNumber')
      .execute(),
  );

  const docketNumbers = dbCaseData.map(({ docketNumber }) => docketNumber);
  const cases = await getCasesByDocketNumbers({ docketNumbers });

  return cases;
};
