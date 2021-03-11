import { state } from 'cerebral';

/**
 * generates an action for completing document signing
 *
 * @param {object} providers the providers object
 * @param {string} providers.get the cerebral get function
 * @param {string} providers.applicationContext the applicationContext
 * @returns {Function} the action to complete the document signing
 */
export const completeDocumentSigningAction = async ({
  applicationContext,
  get,
}) => {
  const {
    nameForSigning,
    nameForSigningLine2,
    pageNumber,
    signatureData: { scale, x, y },
  } = get(state.pdfForSigning);

  const { pdfjsObj } = global;

  // generate signed document to bytes
  const signedPdfBytes = await applicationContext
    .getUseCases()
    .generateSignedDocumentInteractor({
      applicationContext,
      pageIndex: pageNumber - 1,
      // pdf.js starts at 1
      pdfData: await pdfjsObj.getData(),
      posX: x,
      posY: y,
      scale,
      sigTextData: {
        signatureName: `(Signed) ${nameForSigning}`,
        signatureTitle: nameForSigningLine2,
      },
    });

  return { signedPdfBytes };
};
