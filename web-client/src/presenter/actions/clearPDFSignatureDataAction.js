import { state } from 'cerebral';

/**
 * clears saved data for generating a signed PDF
 *
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store used for setting state.pdfForSigning.signatureData
 */
export const clearPDFSignatureDataAction = ({ store }) => {
  store.unset(state.pdfForSigning.signatureData);
  store.set(state.pdfForSigning.signatureApplied, false);
};
