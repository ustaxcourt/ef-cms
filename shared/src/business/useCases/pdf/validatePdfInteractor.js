const { PDFDocumentFactory } = require('pdf-lib');

/**
 * virusScanDocument
 * @param applicationContext
 * @param documentId
 * @returns {Object} errors (null if no errors)
 */
exports.validatePdf = async ({ applicationContext, documentId }) => {
  applicationContext.logger.time('Fetching S3 File');
  let { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: documentId,
    })
    .promise();

  try {
    PDFDocumentFactory.load(pdfData);
    return true;
  } catch (e) {
    applicationContext.logger.time('Invalid PDF: ', documentId);
    return false;
  }
};
