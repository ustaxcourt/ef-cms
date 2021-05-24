import { state } from 'cerebral';

/**
 * removes the current form state for the scanned PDF
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.store the cerebral store
 * @returns {object} the new documentUploadMode
 */
export const removeScannedPdfAction = async ({
  applicationContext,
  get,
  store,
}) => {
  const docketEntryId = get(state.docketEntryId);
  const docketNumber = get(state.caseDetail.docketNumber);
  const documentSelectedForScan = get(
    state.currentViewMetadata.documentSelectedForScan,
  );

  store.unset(state.form[documentSelectedForScan]);
  store.unset(state.form[`${documentSelectedForScan}Size`]);
  store.set(state.scanner.currentPageIndex, 0);
  store.set(state.scanner.selectedBatchIndex, 0);

  const isFileAttached = get(state.form.isFileAttached);

  if (isFileAttached) {
    applicationContext
      .getUseCases()
      .removePdfFromDocketEntryInteractor(applicationContext, {
        docketEntryId,
        docketNumber,
      });

    store.set(state.form.isFileAttached, false);
  }

  return {
    documentType: documentSelectedForScan,
    documentUploadMode: 'scan',
  };
};
