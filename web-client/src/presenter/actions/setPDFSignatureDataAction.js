import { state } from 'cerebral';

/**
 * sets data for generating a signed PDF
 *
 * @param {object} providers the providers object
 * @param {Function} providers.props used for getting signature data
 * @param {Function} providers.store the cerebral store used for setting state.pdfForSigning.signatureData

 */
export const setPDFSignatureDataAction = async ({ props, store }) => {
  const { signatureData } = props;
  store.set(state.pdfForSigning.signatureData, signatureData);
};
