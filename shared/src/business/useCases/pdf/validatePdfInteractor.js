const { StringDecoder } = require('string_decoder');

/**
 * validatePdfInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.documentId the id of the document to validate
 * @returns {object} errors (null if no errors)
 */
exports.validatePdfInteractor = async ({ applicationContext, documentId }) => {
  applicationContext.logger.time(`Fetching S3 File for Validate ${documentId}`);
  let { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: documentId,
    })
    .promise();
  applicationContext.logger.timeEnd(
    `Fetching S3 File for Validate ${documentId}`,
  );

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
