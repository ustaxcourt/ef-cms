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
      .selectFrom('dwCase as case')
      .innerJoin(
        'dwPractitionerOnCase as practitioner',
        'case.docketNumber',
        'practitioner.docketNumber',
      )
      .innerJoin(
        'dwPetitionerOnCase as petitioner',
        'case.docketNumber',
        'petitioner.docketNumber',
      )
      .selectAll()
      .where(eb =>
        eb.or([
          eb('practitioner.userId', '=', 'userId'), // 10502 TODO make sure this is indexed
          eb('petitioner.contactId', '=', 'userId'), // 10502 TODO make sure this is indexed
        ]),
      )
      .select('case.docketNumber')
      .execute(),
  );

  return dbCases?.map(c => transformNullToUndefined(convertDbRowToRawCase(c)));
};
