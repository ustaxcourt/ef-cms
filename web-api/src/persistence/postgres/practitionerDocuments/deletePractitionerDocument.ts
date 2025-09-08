import { pgDeleteFrom } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';

export const deletePractitionerDocument = async ({
  barNumber,
  practitionerDocumentFileId,
}: {
  barNumber: string;
  practitionerDocumentFileId: string;
}) => {
  barNumber = barNumber.toLowerCase();

  await pgDeleteFrom({
    table: 'dwPractitionerDocuments',
    where: cb =>
      cb
        .where('barNumber', '=', barNumber)
        .where('practitionerDocumentFileId', '=', practitionerDocumentFileId),
  });
};
