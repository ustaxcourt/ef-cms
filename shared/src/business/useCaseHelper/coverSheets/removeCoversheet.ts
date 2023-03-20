/**
 * removeCoversheet
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketEntryId the docket entry id
 * @returns {Promise<*>} updated docket entry entity
 */
exports.removeCoversheet = async (applicationContext, { docketEntryId }) => {
  let pdfData;
  try {
    ({ Body: pdfData } = await applicationContext
      .getStorageClient()
      .getObject({
        Bucket: applicationContext.environment.documentsBucketName,
        Key: docketEntryId,
      })
      .promise());
  } catch (err) {
    err.message = `${err.message} docket entry id is ${docketEntryId}`;
    throw err;
  }

  const { PDFDocument } = await applicationContext.getPdfLib();

  const pdfDoc = await PDFDocument.load(pdfData);

  pdfDoc.removePage(0);

  const pdfWithoutCoversheet = await pdfDoc.save();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: pdfWithoutCoversheet,
    key: docketEntryId,
  });

  return { numberOfPages: pdfDoc.getPageCount() };
};
