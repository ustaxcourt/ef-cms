import { getDbReader } from '@web-api/database';

export const getCasesByEmailTotal = async ({ email }: { email: string }) => {
  const rawTotalPetitioners = await getDbReader(reader =>
    reader
      .selectFrom('dwPetitionerOnCase')
      .where('email', '=', email)
      .select(({ fn }) => fn.count('docketNumber').as('count'))
      .executeTakeFirst(),
  );

  const totalPetitioners = rawTotalPetitioners
    ? Number(rawTotalPetitioners.count)
    : 0;

  const rawTotalPractitioners = await getDbReader(reader =>
    reader
      .selectFrom('dwPractitioner as p')
      .leftJoin('dwUserOnCase as uoc', 'uoc.userId', 'p.userId')
      .where('p.email', '=', email)
      .select(({ fn }) => fn.count('uoc.docketNumber').as('count'))
      .executeTakeFirst(),
  );

  const totalPractitioners = rawTotalPractitioners
    ? Number(rawTotalPractitioners.count)
    : 0;

  return totalPetitioners + totalPractitioners;
};
