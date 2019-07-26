import { state } from 'cerebral';

export const scanBatchPreviewerHelper = get => {
  const selectedBatchIndex = get(state.selectedBatchIndex) || 0;
  const batches = get(state.batches);
  const selectedBatch = batches.length
    ? batches[selectedBatchIndex]
    : { pages: [] };
  const currentPageIndex = get(state.currentPageIndex);
  const documentUploadMode = get(state.documentUploadMode);
  let selectPageImage = null;

  const bufferToBase64 = buf => {
    const binstr = Array.prototype.map
      .call(buf, function(ch) {
        return String.fromCharCode(ch);
      })
      .join('');
    return btoa(binstr);
  };

  if (
    batches.length &&
    currentPageIndex !== null &&
    selectedBatchIndex !== null
  ) {
    const page = selectedBatch.pages[currentPageIndex];
    const b64encoded = bufferToBase64(page);
    selectPageImage = b64encoded;
  }

  return {
    batches,
    currentPage: currentPageIndex,
    scannerSource: get(state.scanner.scannerSourceName),
    selectedBatch: batches.length ? batches[selectedBatchIndex] : {},
    selectedPageImage: selectPageImage,
    // sources: get(state.scanner.sources),
    showScannerSourceModal: get(state.showModal) === 'SelectScannerSourceModal',
    totalPages: selectedBatch.pages.length,
    uploadMode: documentUploadMode,
  };
};
