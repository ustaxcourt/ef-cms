/**
 * sanitizePdfInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.key the key of the document to sanitize
 */
exports.sanitizePdfInteractor = async (applicationContext, { key }) => {
  const { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: key,
    })
    .promise();

  const { PDFDocument } = await applicationContext.getPdfLib();

  const pdfDoc = await PDFDocument.load(pdfData, { ignoreEncryption: true });
  const form = pdfDoc.getForm();
  const fieldCount = form.getFields().length;

  if (fieldCount > 0) {
    form.flatten();
    const pdfBytes = await pdfDoc.save();

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: pdfBytes,
      key,
      useTempBucket: false,
    });
  }
};
