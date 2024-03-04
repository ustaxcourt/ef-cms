import { Case } from '../entities/cases/Case';
import { SIMULTANEOUS_DOCUMENT_EVENT_CODES } from '../entities/EntityConstants';

//update all records with docket entry
//processing status and page number
export const updateDocketEntriesPostCoversheetInteractor = async (
  applicationContext: IApplicationContext,
  {
    docketEntryId,
    docketNumber,
    updatedDocketEntryData,
  }: {
    docketEntryId: string;
    docketNumber: string;
    updatedDocketEntryData: {
      numberOfPages;
      consolidatedCases;
    };
  },
) => {
  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseRecord, { applicationContext });

  let docketNumbersToUpdate = [docketNumber];

  if (updatedDocketEntryData.consolidatedCases) {
    docketNumbersToUpdate = updatedDocketEntryData.consolidatedCases
      .filter(consolidatedCase => consolidatedCase.documentNumber)
      .map(({ docketNumber: caseDocketNumber }) => caseDocketNumber);
  }

  const updatedDocketEntries = await Promise.all(
    docketNumbersToUpdate.map(async caseDocketNumber => {
      // in one instance, we pass in the caseEntity which we don't want to refetch
      let consolidatedCaseEntity = caseEntity;
      if (caseEntity && caseDocketNumber !== docketNumber) {
        const cCaseRecord = await applicationContext
          .getPersistenceGateway()
          .getCaseByDocketNumber({
            applicationContext,
            docketNumber: caseDocketNumber,
          });
        consolidatedCaseEntity = new Case(cCaseRecord, {
          applicationContext,
        });
      }

      const consolidatedCaseDocketEntryEntity =
        consolidatedCaseEntity!.getDocketEntryById({
          docketEntryId,
        });

      if (consolidatedCaseDocketEntryEntity) {
        const isSimultaneousDocType =
          SIMULTANEOUS_DOCUMENT_EVENT_CODES.includes(
            consolidatedCaseDocketEntryEntity.eventCode,
          ) ||
          consolidatedCaseDocketEntryEntity.documentTitle?.includes(
            'Simultaneous',
          );

        if (
          !isSimultaneousDocType ||
          (isSimultaneousDocType &&
            caseEntity &&
            caseDocketNumber === docketNumber)
        ) {
          consolidatedCaseDocketEntryEntity.setAsProcessingStatusAsCompleted();
        }

        consolidatedCaseDocketEntryEntity.setNumberOfPages(
          updatedDocketEntryData.numberOfPages,
        );

        const updateConsolidatedDocketEntry = consolidatedCaseDocketEntryEntity
          .validate()
          .toRawObject();

        await applicationContext.getPersistenceGateway().updateDocketEntry({
          applicationContext,
          docketEntryId,
          docketNumber: caseDocketNumber,
          document: updateConsolidatedDocketEntry,
        });
        return updateConsolidatedDocketEntry;
      }
    }),
  );

  return updatedDocketEntries
    .filter(Boolean)
    .find(entry => entry.docketNumber === docketNumber);
};
