import { state } from 'cerebral';

/**
 * sets the page for a PDF for signing
 *
 * @param {object} providers the providers object
 * @param {Function} providers.props used for getting pageNumber
 * @param {Function} providers.store the cerebral store used for setting state.pdfForSigning.pageNumber
 */
export const setPDFPageForSigningAction = ({ props, store }) => {
  const { pageNumber } = props;
  store.set(state.pdfForSigning.pageNumber, pageNumber || 1);
};
