import { ServerApplicationContext } from '@web-api/applicationContext';
import { getCaseMetadataWithCounsel } from '@web-api/persistence/postgres/cases/getCaseMetadataWithCounsel';
import { getDbReader } from '@web-api/database';

export const getCasesMetadataWithCounselByLeadDocketNumber = async ({
  applicationContext,
  leadDocketNumber,
}: {
  applicationContext: ServerApplicationContext;
  leadDocketNumber: string;
}): Promise<
  Omit<RawCase, 'consolidatedCases' | 'correspondence' | 'docketEntries'>[]
> => {
  const dbCaseData = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .where('leadDocketNumber', '=', leadDocketNumber)
      .select('docketNumber')
      .execute(),
  );

  const cases = await Promise.all(
    dbCaseData.map(({ docketNumber }) =>
      getCaseMetadataWithCounsel({
        applicationContext,
        docketNumber,
      }),
    ),
  );

  return cases.filter(c => !!c);
};
