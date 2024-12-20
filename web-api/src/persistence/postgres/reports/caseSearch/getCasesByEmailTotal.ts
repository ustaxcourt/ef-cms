import { getDbReader } from '@web-api/database';

export const getCasesByEmailTotal = async (email: string) => {
  const total = await getDbReader(reader =>
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
      .where(eb =>
        eb.or([
          eb('practitioner.email', '=', email), // 10502 TODO make sure this is indexed
          eb('petitioner.email', '=', email), // 10502 TODO make sure this is indexed
        ]),
      )
      .select(({ fn }) => fn.count('docketNumber').as('count'))
      .execute(),
  );

  return Number(total[0].count);
};
