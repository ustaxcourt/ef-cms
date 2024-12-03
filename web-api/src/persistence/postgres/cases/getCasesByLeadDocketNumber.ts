// import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
// import { getDbReader } from '@web-api/database';

// export const getCasesByLeadDocketNumber = async ({
//   leadDocketNumber,
// }: {
//   leadDocketNumber: string;
// }): Promise<Case[] | undefined> => {
//   const dbCases = await getDbReader(reader =>
//     reader
//       .selectFrom('dwCase')
//       .where('leadDocketNumber', 'in', leadDocketNumber)
//       .selectAll()
//       .execute(),
//   );

//   const cases = await Promise.all(
//     dbCases.map(({ docketNumber }) =>
//       getCaseByDocketNumber({
//         applicationContext,
//         authorizedUser: undefined,
//         docketNumber, // 10502 TODO
//       }),
//     ),
//   );
// };
