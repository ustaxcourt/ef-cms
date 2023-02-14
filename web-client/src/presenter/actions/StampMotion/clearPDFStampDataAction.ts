import { state } from 'cerebral';

/**
 * clears saved data for generating a stamped motion PDF
 *
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store
 */
export const clearPDFStampDataAction = ({ store }) => {
  store.set(state.pdfForSigning.stampApplied, false);
};
