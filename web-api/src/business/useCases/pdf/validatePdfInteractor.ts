import { ServerApplicationContext } from '@web-api/applicationContext';
import { StringDecoder } from 'string_decoder';

export const removePdf = async ({
  applicationContext,
  key,
  message = 'PDF Error',
}) => {
  applicationContext.logger.debug(`${message}: Deleting from S3`, key);
  await applicationContext.getPersistenceGateway().deleteDocumentFile({
    applicationContext,
    key,
  });
};

/**
 * validatePdfInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.key the key of the document to validate
 * @throws {Error} if pdf is invalid
 */
export const validatePdfInteractor = async (
  applicationContext: ServerApplicationContext,
  { key }: { key: string },
) => {
  const pdfData = await applicationContext.getPersistenceGateway().getDocument({
    applicationContext,
    key,
  });

  const stringDecoder = new StringDecoder('utf8');
  const pdfHeaderBytes = pdfData.slice(0, 5);
  const pdfHeaderString = stringDecoder.write(pdfHeaderBytes);

  applicationContext.logger.debug('pdfHeaderBytes', pdfHeaderBytes);
  applicationContext.logger.debug('pdfHeaderString', pdfHeaderString);

  const { PDFDocument } = await applicationContext.getPdfLib();

  const pdfDoc = await PDFDocument.load(pdfData, { ignoreEncryption: true });
  const pdfIsEncrypted = pdfDoc.isEncrypted;

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
};
