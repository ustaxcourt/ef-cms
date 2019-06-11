const { PDFParser, PDFObjectIndex } = require('pdf-lib');

/**
 * validatePdf
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
    const index = PDFObjectIndex.create();
    const pdfParser = new PDFParser();
    return !!pdfParser.parse(pdfData, index);
  } catch (e) {
    applicationContext.logger.error('Invalid PDF', { documentId, e });
    throw new Error('Invalid PDF', e);
  }
};
