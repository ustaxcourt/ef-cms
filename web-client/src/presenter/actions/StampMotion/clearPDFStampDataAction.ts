import { state } from '@web-client/presenter/app.cerebral';

/**
 * clears saved data for generating a stamped motion PDF
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store
 */
export const clearPDFStampDataAction = ({ store }: ActionProps) => {
  store.set(state.pdfForSigning.stampApplied, false);
};
