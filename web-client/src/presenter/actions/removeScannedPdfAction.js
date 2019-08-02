import { state } from 'cerebral';

/**
 * removes the current form state for the scanned PDF
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 * @param {object} providers.get the cerebral get function
 * @returns {object} the new documentUploadMode
 *
 */
export const removeScannedPdfAction = async ({ get, store }) => {
  const documentSelectedForScan = get(state.documentSelectedForScan);

  store.set(state.form[documentSelectedForScan], null);
  store.set(state.form[`${documentSelectedForScan}Size`], null);
  store.set(state.currentPageIndex, 0);
  store.set(state.selectedBatchIndex, 0);

  return {
    documentUploadMode: 'scan',
  };
};
