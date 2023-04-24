import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * Uploads external documents and calls the interactor to associate them with one or more cases
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {Array} providers.documentFiles array of file objects
 * @param {object} providers.documentMetadata metadata associated with the documents/cases
 * @param {string} providers.progressFunctions callback functions for updating the progress indicator during file upload
 * @returns {Promise<Object>} the case details with the uploaded document(s) attached
 */
export const validateFileInteractor = async (
  applicationContext: any,
  {
    primaryDocumentFile,
  }: {
    primaryDocumentFile: any;
  },
) => {
  const { PDFDocument } = await applicationContext.getPdfLib();
  const pdfDoc = await PDFDocument.load(primaryDocumentFile, {
    ignoreEncryption: true, // todo: wha???????
  });
  const pdfIsEncrypted = pdfDoc.isEncrypted;

  applicationContext.logger.debug('pdfIsEncrypted', pdfIsEncrypted);

  if (pdfIsEncrypted) {
    // await removePdf({
    //   applicationContext,
    //   key,
    //   message: 'PDF Invalid',
    // });

    throw new Error('invalid pdf');
  }
};
