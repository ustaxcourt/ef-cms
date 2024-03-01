import { Case } from '../entities/cases/Case';
import { SIMULTANEOUS_DOCUMENT_EVENT_CODES } from '../entities/EntityConstants';
import { addCoverToPdf } from './addCoverToPdf';

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
  applicationContext: IApplicationContext,
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
) => {
  if (!caseEntity) {
    const caseRecord = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      });

    caseEntity = new Case(caseRecord, { applicationContext });
  }

  let pdfData;
  try {
    const { Body } = await applicationContext
      .getStorageClient()
      .getObject({
        Bucket: applicationContext.environment.documentsBucketName,
        Key: docketEntryId,
      })
      .promise();

    pdfData = Body;
  } catch (err) {
    applicationContext.logger.error(
      `Failed to get document for docket entry id ${docketEntryId} `,
      err,
    );
    throw err;
  }

  const docketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId,
  });

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
    applicationContext,
    document: newPdfData,
    key: docketEntryId,
  });

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
