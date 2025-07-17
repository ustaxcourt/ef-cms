import { RawPractitionerDocument } from '@shared/business/entities/PractitionerDocument';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const createOrEditPractitionerDocument = async ({
  barNumber,
  practitionerDocument,
}: {
  barNumber: string;
  practitionerDocument: RawPractitionerDocument;
}) => {
  barNumber = barNumber.toLowerCase();

  await pgInsertInto({
    table: 'dwPractitionerDocuments',
    values: { ...practitionerDocument, barNumber },
    onConflictColumns: ['barNumber', 'practitionerDocumentFileId'],
  });
};
