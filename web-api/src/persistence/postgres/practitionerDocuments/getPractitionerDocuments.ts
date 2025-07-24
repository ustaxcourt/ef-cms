import { getDbReader } from '@web-api/database';
import { practitionerDocumentEntity } from '@web-api/persistence/postgres/practitionerDocuments/mapper';

export const getPractitionerDocuments = async ({
  barNumber,
}: {
  barNumber: string;
}) => {
  barNumber = barNumber.toLowerCase();

  return practitionerDocumentEntity(
    await getDbReader(reader =>
      reader
        .selectFrom('dwPractitionerDocuments as p')
        .where('p.barNumber', '=', barNumber)
        .selectAll('p')
        .execute(),
    ),
  );
};
