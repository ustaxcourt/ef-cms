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
  const documentSelectedForScan = get(
    state.currentViewMetadata.documentSelectedForScan,
  );

  store.unset(state.form[documentSelectedForScan]);
  store.unset(state.form[`${documentSelectedForScan}Size`]);
  store.set(state.scanner.currentPageIndex, 0);
  store.set(state.scanner.selectedBatchIndex, 0);

  return {
    documentType: documentSelectedForScan,
    documentUploadMode: 'scan',
  };
};
