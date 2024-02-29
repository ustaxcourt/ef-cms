import { Case } from '../entities/cases/Case';
import { SIMULTANEOUS_DOCUMENT_EVENT_CODES } from '../entities/EntityConstants';

export const updateDocketEntriesInteractor = async (
  applicationContext: IApplicationContext,
  {
    caseEntity,
    consolidatedCases,
    docketEntryId,
    docketNumber,
    numberOfPages,
    updatedDocketEntryData,
  }: {
    caseEntity?: Case;
    consolidatedCases;
    docketEntryId: string;
    docketNumber: string;
    numberOfPages;
    updatedDocketEntryData: any;
  },
) => {
  console.log('****************updatedDocketEntryData', updatedDocketEntryData);

  if (!caseEntity) {
    const caseRecord = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      });

    caseEntity = new Case(caseRecord, { applicationContext });
  }

  let docketNumbersToUpdate = [docketNumber];

  if (consolidatedCases) {
    docketNumbersToUpdate = consolidatedCases
      .filter(consolidatedCase => consolidatedCase.documentNumber)
      .map(({ docketNumber: caseDocketNumber }) => caseDocketNumber);
  }

  const updatedDocketEntries = await Promise.all(
    docketNumbersToUpdate.map(async caseDocketNumber => {
      // in one instance, we pass in the caseEntity which we don't want to refetch
      let consolidatedCaseEntity = caseEntity;
      if (caseEntity && caseDocketNumber !== docketNumber) {
        const caseRecord = await applicationContext
          .getPersistenceGateway()
          .getCaseByDocketNumber({
            applicationContext,
            docketNumber: caseDocketNumber,
          });
        consolidatedCaseEntity = new Case(caseRecord, {
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

        consolidatedCaseDocketEntryEntity.setNumberOfPages(numberOfPages);

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
