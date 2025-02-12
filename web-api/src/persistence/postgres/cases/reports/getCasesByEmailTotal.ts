export const getCasesByEmailTotal = async ({
  email,
  role,
}: {
  email: string;
  role: string;
}) => {
  return await getCasesByEmailTotal({ email, role });

  // Once practitioners are in postgres, we can do the following:
  //   import { ROLES } from '@shared/business/entities/EntityConstants';
  // import { getDbReader } from '@web-api/database';
  // let table: 'dwPetitionerOnCase' | 'dwPractitionerOnCase' =
  //   'dwPractitionerOnCase';
  // if (role === ROLES.petitioner) {
  //   table = 'dwPetitionerOnCase';
  // }
  // const total = await getDbReader(reader =>
  //   reader
  //     .selectFrom(table)
  //     .where('email', '=', email)
  //     .select(({ fn }) => fn.count('docketNumber').as('count'))
  //     .execute(),
  // );
  // return Number(total[0].count);
};
