import { getDbReader } from '@web-api/database';

export const getPractitionerDocumentByFileId = async ({
  barNumber,
  fileId,
}: {
  barNumber: string;
  fileId: string;
}) => {
  barNumber = barNumber.toLowerCase();

  return await getDbReader(reader =>
    reader
      .selectFrom('dwPractitionerDocuments as p')
      .where('p.barNumber', '=', barNumber)
      .where('p.practitionerDocumentFileId', '=', fileId)
      .selectAll('p')
      .executeTakeFirst(),
  );
};
