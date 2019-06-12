const { StringDecoder } = require('string_decoder');

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

  const stringDecoder = new StringDecoder('utf8');
  const pdfHeaderBytes = pdfData.slice(0, 5);
  const pdfHeaderString = stringDecoder.write(pdfHeaderBytes);

  applicationContext.logger.info('pdfHeaderBytes', pdfHeaderBytes);
  applicationContext.logger.info('pdfHeaderString', pdfHeaderString);

  if (pdfHeaderString !== '%PDF-') {
    throw new Error('invalid pdf');
  }

  return true;
};
