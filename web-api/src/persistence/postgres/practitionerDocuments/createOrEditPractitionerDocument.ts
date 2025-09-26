import { RawPractitionerDocument } from '@shared/business/entities/PractitionerDocument';
import { toKyselyNewPractitionerDocument } from '@web-api/persistence/postgres/practitionerDocuments/mapper';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const createOrEditPractitionerDocument = async ({
  barNumber,
  practitionerDocument,
}: {
  barNumber: string;
  practitionerDocument: RawPractitionerDocument;
}) => {
  await pgInsertInto({
    table: 'dwPractitionerDocuments',
    values: toKyselyNewPractitionerDocument(practitionerDocument, barNumber),
    onConflictColumns: ['practitionerDocumentFileId'],
  });
};
