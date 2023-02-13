import { state } from 'cerebral';

/**
 * sets data for generating a stamped motion PDF
 *
 * @param {object} providers the providers object
 * @param {Function} providers.props used for getting stamp data
 * @param {Function} providers.store the cerebral store used for setting state.pdfForSigning
 */
export const setPDFStampDataAction = ({ props, store }) => {
  const { stampApplied } = props;

  store.set(state.pdfForSigning.stampApplied, stampApplied);
};
