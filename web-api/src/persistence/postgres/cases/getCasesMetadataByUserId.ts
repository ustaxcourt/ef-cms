import { convertDbRowToRawCase } from '@web-api/persistence/postgres/cases/mapper';
import { getDbReader } from '@web-api/database';
import { isEmpty } from 'lodash';
import { transformNullToUndefined } from '@web-api/persistence/postgres/utils/transformNullToUndefined';

export const getCasesMetadataByUserId = async ({
  userId,
}: {
  userId: string;
}): Promise<RawCase[] | undefined> => {
  if (isEmpty(userId)) {
    return [];
  }

  const dbCases = await getDbReader(reader =>
    reader
      .selectFrom('dwCase as c')
      .innerJoin(
        'dwPractitionerOnCase as pr',
        'c.docketNumber',
        'pr.docketNumber',
      )
      .innerJoin('dwPetitionerOnCase as p', 'c.docketNumber', 'p.docketNumber')
      .selectAll()
      .where(eb =>
        eb.or([
          eb('pr.userId', '=', 'userId'),
          eb('p.contactId', '=', 'userId'),
        ]),
      )
      .select('c.docketNumber')
      .execute(),
  );

  return dbCases?.map(c => transformNullToUndefined(convertDbRowToRawCase(c)));
};
