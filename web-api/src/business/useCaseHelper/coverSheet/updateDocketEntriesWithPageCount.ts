import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { SIMULTANEOUS_DOCUMENT_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { upsertDocketEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';

export const updateDocketEntriesWithPageCount = async ({
  authorizedUser,
  caseEntity,
  consolidatedCases,
  docketEntryId,
  docketNumber,
  pageCount,
}: {
  authorizedUser: UnknownAuthUser;
  caseEntity: Case;
  consolidatedCases: Array<{
    docketNumber: string;
    documentNumber?: string;
  }> | null;
  docketEntryId: string;
  docketNumber: string;
  pageCount: number;
}) => {
  let docketNumbersToUpdate = [docketNumber];

  if (consolidatedCases) {
    docketNumbersToUpdate = consolidatedCases
      .filter(consolidatedCase => consolidatedCase.documentNumber)
      .map(({ docketNumber: caseDocketNumber }) => caseDocketNumber);
  }

  const casesToUpdate = await getCasesByDocketNumbers({
    docketNumbers: docketNumbersToUpdate,
  });

  const updatedDocketEntries = casesToUpdate
    .map(caseRecord => {
      const consolidatedCaseEntity =
        caseRecord.docketNumber === docketNumber
          ? caseEntity
          : new Case(caseRecord, {
              authorizedUser,
            });

      const consolidatedCaseDocketEntry =
        consolidatedCaseEntity!.getDocketEntryById({
          docketEntryId,
        });

      if (consolidatedCaseDocketEntry) {
        const isSimultaneousDocType =
          SIMULTANEOUS_DOCUMENT_EVENT_CODES.includes(
            consolidatedCaseDocketEntry.eventCode,
          ) ||
          consolidatedCaseDocketEntry.documentTitle?.includes('Simultaneous');

        const consolidatedCaseDocketEntryEntity = new DocketEntry(
          consolidatedCaseDocketEntry,
          { authorizedUser },
        );

        if (
          !isSimultaneousDocType ||
          (isSimultaneousDocType &&
            caseEntity &&
            caseRecord.docketNumber === docketNumber)
        ) {
          consolidatedCaseDocketEntryEntity.setAsProcessingStatusAsCompleted();
        }

        consolidatedCaseDocketEntryEntity.setNumberOfPages(pageCount);

        const updateConsolidatedDocketEntry = consolidatedCaseDocketEntryEntity
          .validate()
          .toRawObject();

        return updateConsolidatedDocketEntry;
      }
    })
    .filter(docketEntry => docketEntry !== undefined);

  await upsertDocketEntries(updatedDocketEntries);

  return updatedDocketEntries;
};
