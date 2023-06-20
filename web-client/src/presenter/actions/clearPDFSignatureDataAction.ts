import { state } from '@web-client/presenter/app.cerebral';

/**
 * clears saved data for generating a signed PDF
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store used for setting state.pdfForSigning.signatureData
 */
export const clearPDFSignatureDataAction = ({ store }: ActionProps) => {
  store.unset(state.pdfForSigning.signatureData);
  store.set(state.pdfForSigning.signatureApplied, false);
};
