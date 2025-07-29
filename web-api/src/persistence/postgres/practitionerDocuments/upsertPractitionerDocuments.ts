import { toKyselyNewPractitionerDocument } from '@web-api/persistence/postgres/practitionerDocuments/mapper';
import { pgInsertInto } from '@web-api/persistence/postgres/utils/operation/pgInsertInto';

export const upsertPractitionerDocuments = async (
  practitionerDocuments: any[],
) => {
  if (practitionerDocuments.length === 0) return;

  const practitionerDocumentsToUpsert = practitionerDocuments.map(
    practitionerDocument => {
      return toKyselyNewPractitionerDocument(
        practitionerDocument,
        practitionerDocument.barNumber.toLowerCase(),
      );
    },
  );

  await pgInsertInto({
    table: 'dwPractitionerDocuments',
    values: practitionerDocumentsToUpsert,
    onConflictColumns: ['practitionerDocumentFileId'],
  });
};
