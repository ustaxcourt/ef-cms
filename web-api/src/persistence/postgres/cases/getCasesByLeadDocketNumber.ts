import { ServerApplicationContext } from '@web-api/applicationContext';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getDbReader } from '@web-api/database';

export const getCasesByLeadDocketNumber = async ({
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
      getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      }),
    ),
  );

  return cases.filter(c => !!c);
};
