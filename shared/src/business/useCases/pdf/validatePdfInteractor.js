const { StringDecoder } = require('string_decoder');

const removePdf = async ({
  applicationContext,
  key,
  message = 'PDF Error',
}) => {
  applicationContext.logger.debug(`${message}: Deleting from S3`, key);
  await applicationContext.getPersistenceGateway().deleteDocumentFromS3({
    applicationContext,
    key,
  });
};

exports.removePdf = removePdf;

/**
 * validatePdfInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.key the key of the document to validate
 * @returns {object} errors (null if no errors)
 */
exports.validatePdfInteractor = async (applicationContext, { key }) => {
  let { Body: pdfData } = await applicationContext
    .getStorageClient()
    .getObject({
      Bucket: applicationContext.environment.documentsBucketName,
      Key: key,
    })
    .promise();

  const stringDecoder = new StringDecoder('utf8');
  const pdfHeaderBytes = pdfData.slice(0, 5);
  const pdfHeaderString = stringDecoder.write(pdfHeaderBytes);

  applicationContext.logger.debug('pdfHeaderBytes', pdfHeaderBytes);
  applicationContext.logger.debug('pdfHeaderString', pdfHeaderString);

  let pdfIsEncrypted = false;

  const { PDFDocument } = await applicationContext.getPdfLib();

  const pdfDoc = await PDFDocument.load(pdfData, { ignoreEncryption: true });
  pdfIsEncrypted = pdfDoc.isEncrypted;

  applicationContext.logger.debug('pdfIsEncrypted', pdfIsEncrypted);

  if (pdfIsEncrypted || pdfHeaderString !== '%PDF-') {
    await removePdf({
      applicationContext,
      key,
      message: 'PDF Invalid',
    });

    throw new Error('invalid pdf');
  }

  try {
    pdfDoc.getPages();
  } catch (e) {
    await removePdf({
      applicationContext,
      key,
      message: 'PDF Pages Unreadable',
    });

    throw new Error('pdf pages cannot be read');
  }

  return true;
};
