import { state } from 'cerebral';

/**
 * clears saved data for generating a signed PDF
 *
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store used for setting state.pdfForSigning.signatureData

 */
export const clearPDFSignatureDataAction = async ({ store }) => {
  store.set(state.pdfForSigning.signatureData, null);
  store.set(state.pdfForSigning.signatureApplied, false);
};
