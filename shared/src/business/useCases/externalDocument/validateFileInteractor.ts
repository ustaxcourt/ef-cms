import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '../../../errors/errors';

/**
 * Uploads external documents and calls the interactor to associate them with one or more cases
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {Array} providers.primaryDocumentFile pdf to
 * @returns {Promise<Object>} the case details with the uploaded document(s) attached
 */
export const validateFileInteractor = async (
  applicationContext: any,
  {
    primaryDocumentFile,
  }: {
    applicationContext: any;
    primaryDocumentFile: any;
  },
) => {
  const aBlob = new Blob([primaryDocumentFile]);
  const arrayBuffer = await aBlob.arrayBuffer();

  const { PDFDocument } = await applicationContext.getPdfLib();
  try {
    await PDFDocument.load(arrayBuffer);
  } catch (e) {
    console.log('***** e ', e.message, typeof e);
    if (
      e.message.includes('Input document to `PDFDocument.load` is encrypted')
    ) {
      throw new Error('');
    }
  }
};
