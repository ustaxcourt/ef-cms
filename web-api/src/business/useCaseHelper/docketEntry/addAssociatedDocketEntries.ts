import { CourtIssuedDocumentAnyType } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { upsertDocketEntryRelatedEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntryRelatedEntries';

export async function addAssociatedDocketEntries(
  casesToUpdate: Omit<RawCase, 'consolidatedCases'>[],
  documentMeta: CourtIssuedDocumentAnyType,
  subjectDocketEntry: DocketEntry,
  served: boolean,
) {
  const docketEntryOrderMotions = casesToUpdate.flatMap(caseToUpdate => {
    return Object.values(documentMeta.affectedDocketEntries!)
      .filter(motion => {
        return caseToUpdate.docketEntries.find(
          docketEntry => docketEntry.docketEntryId === motion.docketEntryId,
        );
      })
      .map(motion => ({
        docketEntryId: motion.docketEntryId,
        docketNumber: caseToUpdate.docketNumber,
        disposition: motion.disposition,
      }));
  });

  await upsertDocketEntryRelatedEntries({
    orderDocketEntry: subjectDocketEntry,
    motionDocketEntries: docketEntryOrderMotions,
    served,
  });
}
