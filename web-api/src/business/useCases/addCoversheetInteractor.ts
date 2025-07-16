import { Case } from '@shared/business/entities/cases/Case';
import { SIMULTANEOUS_DOCUMENT_EVENT_CODES } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { addCoverToPdf } from './addCoverToPdf';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { upsertDocketEntries } from '@web-api/persistence/postgres/docketEntries/upsertDocketEntries';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { NotFoundError } from '@web-api/errors/errors';
import { DocketEntry } from '@shared/business/entities/DocketEntry';

/**
 * addCoversheetInteractor
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketEntryId the docket entry id
 * @param {string} providers.docketNumber the docket number of the case
 * @param {boolean} providers.filingDateUpdated flag that represents if the filing date was updated
 * @param {boolean} providers.replaceCoversheet flag that represents if the coversheet should be replaced
 * @param {boolean} providers.useInitialData flag that represents to use initial data
 * @returns {Promise<*>} updated docket entry entity
 */
export const addCoversheetInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    caseEntity,
    docketEntryId,
    docketNumber,
    filingDateUpdated = false,
    replaceCoversheet = false,
    useInitialData = false,
  }: {
    caseEntity?: Case;
    docketEntryId: string;
    docketNumber: string;
    filingDateUpdated?: boolean;
    replaceCoversheet?: boolean;
    useInitialData?: boolean;
  },
  authorizedUser: UnknownAuthUser,
) => {
  if (!caseEntity) {
    const caseRecord = await getCaseByDocketNumber({
      docketNumber,
    });

    caseEntity = new Case(caseRecord, {
      authorizedUser,
    });
  }

  const pdfData = await applicationContext.getPersistenceGateway().getDocument({
    applicationContext,
    key: docketEntryId,
  });

  const docketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!docketEntryEntity) {
    throw new NotFoundError(
      `Could not find docket entry with id ${docketEntryId} on case ${docketNumber}`,
    );
  }

  const {
    consolidatedCases, // if feature flag is off, this will always be null
    numberOfPages,
    pdfData: newPdfData,
  } = await addCoverToPdf({
    applicationContext,
    caseEntity,
    docketEntryEntity,
    filingDateUpdated,
    pdfData,
    replaceCoversheet,
    useInitialData,
  });

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    document: newPdfData,
    key: docketEntryId,
  });

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

        consolidatedCaseDocketEntryEntity.setNumberOfPages(numberOfPages);

        const updateConsolidatedDocketEntry = consolidatedCaseDocketEntryEntity
          .validate()
          .toRawObject();

        return updateConsolidatedDocketEntry;
      }
    })
    .filter(docketEntry => docketEntry !== undefined);

  await upsertDocketEntries(updatedDocketEntries);

  return updatedDocketEntries.find(
    entry => entry.docketNumber === docketNumber,
  );
};
