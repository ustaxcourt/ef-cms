import { getDbReader } from '@web-api/database';

export const getPractitionerDocuments = async ({
  barNumber,
}: {
  barNumber: string;
}) => {
  barNumber = barNumber.toLowerCase();

  return await getDbReader(reader =>
    reader
      .selectFrom('dwPractitionerDocuments as p')
      .where('p.barNumber', '=', barNumber)
      .selectAll('p')
      .execute(),
  );
};
