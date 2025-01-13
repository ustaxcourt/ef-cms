import { ROLES } from '@shared/business/entities/EntityConstants';
import { getDbReader } from '@web-api/database';

export const getCasesByEmailTotal = async ({
  email,
  role,
}: {
  email: string;
  role: string;
}) => {
  let table: 'dwPetitionerOnCase' | 'dwPractitionerOnCase' =
    'dwPractitionerOnCase';
  if (role === ROLES.petitioner) {
    table = 'dwPetitionerOnCase';
  }
  const total = await getDbReader(reader =>
    reader
      .selectFrom(table)
      .where('email', '=', email)
      .select(({ fn }) => fn.count('docketNumber').as('count'))
      .execute(),
  );
  return Number(total[0].count);
};
