import { RawPractitionerDocument } from '@shared/business/entities/PractitionerDocument';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { practitionerDocumentEntity } from '@web-api/persistence/postgres/practitionerDocuments/mapper';

export const getPractitionerDocuments = async ({
  barNumber,
}: {
  barNumber: string;
}): Promise<RawPractitionerDocument[]> => {
  const practitionerDocuments = await getDbReader(reader =>
    reader
      .selectFrom('dwPractitionerDocuments as p')
      .where('p.barNumber', '=', barNumber)
      .selectAll('p')
      .execute(),
  );

  return practitionerDocuments.map(practitionerDocument =>
    practitionerDocumentEntity(practitionerDocument),
  );
};
