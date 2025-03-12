import { ServerApplicationContext } from '@web-api/applicationContext';
import { getCaseMetadataWithCounsel } from '@web-api/persistence/postgres/cases/getCaseMetadataWithCounsel';
import { getDbReader } from '@web-api/database';

export const getCasesMetadataWithCounselByLeadDocketNumber = async ({
  applicationContext,
  leadDocketNumber,
}: {
  applicationContext: ServerApplicationContext;
  leadDocketNumber: string;
}): Promise<RawCase[]> => {
  const dbCases = await getDbReader(reader =>
    reader
      .selectFrom('dwCase')
      .where('leadDocketNumber', '=', leadDocketNumber)
      .selectAll()
      .execute(),
  );

  const cases = await Promise.all(
    dbCases.map(({ docketNumber }) =>
      getCaseMetadataWithCounsel({
        applicationContext,
        docketNumber,
      }),
    ),
  );

  return cases.filter(c => !!c);
};
