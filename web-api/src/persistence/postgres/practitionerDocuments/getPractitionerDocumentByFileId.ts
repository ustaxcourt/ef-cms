import { RawPractitionerDocument } from '@shared/business/entities/PractitionerDocument';
import { getDbReader } from '@web-api/persistence/postgres/database';
import { practitionerDocumentEntity } from '@web-api/persistence/postgres/practitionerDocuments/mapper';

export const getPractitionerDocumentByFileId = async ({
  barNumber,
  fileId,
}: {
  barNumber: string;
  fileId: string;
}): Promise<RawPractitionerDocument> => {
  const practitionerDocument = await getDbReader(reader =>
    reader
      .selectFrom('dwPractitionerDocuments as p')
      .where('p.barNumber', '=', barNumber)
      .where('p.practitionerDocumentFileId', '=', fileId)
      .selectAll('p')
      .executeTakeFirst(),
  );

  return practitionerDocumentEntity(practitionerDocument);
};
