import { addCoverToPdf } from '../../useCases/addCoverToPdf';

/**
 * generateAndAddCoversheetToDocketEntry
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketEntryId the docket entry id
 * @param {boolean} providers.filingDateUpdated flag that represents if the filing date was updated
 * @param {boolean} providers.replaceCoversheet flag that represents if the coversheet should be replaced
 * @param {boolean} providers.useInitialData flag that represents to use initial data
 * @returns {Promise<*>} updated docket entry entity
 */
export const generateAndAddCoversheetToDocketEntry = async (
  applicationContext: IApplicationContext,
  {
    caseEntity,
    docketEntryId,
    filingDateUpdated,
  }: {
    caseEntity: TCaseEntity;
    docketEntryId: string;
    filingDateUpdated: boolean;
  },
) => {
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
    err.message = `${err.message} docket entry id is ${docketEntryId}`;
    throw err;
  }

  const docketEntryEntity = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  const { pdfData: newPdfData } = await addCoverToPdf({
    applicationContext,
    caseEntity,
    docketEntryEntity,
    filingDateUpdated,
    pdfData,
  });

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: newPdfData,
    key: docketEntryId,
  });
};
