/**
 * sanitizePdfInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.key the key of the document to validate
 * @returns {object} errors (null if no errors)
 */
exports.sanitizePdfInteractor = async (applicationContext, { key }) => {
  let { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: key,
    })
    .promise();

  const { PDFDocument } = await applicationContext.getPdfLib();

  const pdfDoc = await PDFDocument.load(pdfData, { ignoreEncryption: true });
  const form = pdfDoc.getForm();
  form.flatten();
  const pdfBytes = await pdfDoc.save();

  await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
    applicationContext,
    document: pdfBytes,
    key,
    useTempBucket: false,
  });

  return true;
};
