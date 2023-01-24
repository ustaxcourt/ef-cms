import { removeCoverFromPdf } from '../coverSheets/removeCoversheet';

/**
 * removeCoversheetFromDocketEntry
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketEntryId the docket entry id
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {Promise<*>} updated docket entry entity
 */
export const removeCoversheetFromDocketEntry = async (
  applicationContext: IApplicationContext,
  { docketEntry }: { docketEntry: TDocketEntryEntity },
) => {
  let pdfData;
  try {
    const { Body } = await applicationContext
      .getStorageClient()
      .getObject({
        Bucket: applicationContext.environment.documentsBucketName,
        Key: docketEntry.docketEntryId,
      })
      .promise();
    pdfData = Body;
  } catch (err) {
    err.message = `${err.message} docket entry id is ${docketEntry.docketEntryId}`;
    throw err;
  }

  const { pdfData: newPdfData } = await removeCoverFromPdf({
    applicationContext,
    pdfData,
  });

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: newPdfData,
    key: docketEntry.docketEntryId,
  });
};
