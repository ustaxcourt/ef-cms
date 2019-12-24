import { state } from 'cerebral';

export const scanBatchPreviewerHelper = get => {
  const selectedBatchIndex = get(state.selectedBatchIndex) || 0;
  const documentSelectedForScan = get(state.documentSelectedForScan);
  const batches =
    (documentSelectedForScan && get(state.batches[documentSelectedForScan])) ||
    [];
  const selectedBatch = batches.length
    ? batches.find(b => b.index === selectedBatchIndex)
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

  if (batches.length && currentPageIndex !== null) {
    const page = selectedBatch.pages[currentPageIndex];
    const b64encoded = bufferToBase64(page);
    selectPageImage = b64encoded;
  }

  const duplexEnabled = get(state.scanner.duplexEnabled);
  const scannerSource = get(state.scanner.scannerSourceName);

  let scannerSourceDisplayName = 'None';
  if (scannerSource) {
    scannerSourceDisplayName = `${scannerSource} (${(duplexEnabled &&
      'Double') ||
      'Single'} sided)`;
  }

  return {
    batches,
    currentPage: currentPageIndex,
    scannerSource,
    scannerSourceDisplayName,
    selectedBatch: batches.length
      ? batches.find(b => b.index === selectedBatchIndex)
      : {},
    selectedPageImage: selectPageImage,
    showScannerSourceModal: get(state.showModal) === 'SelectScannerSourceModal',
    totalPages: selectedBatch.pages.length,
    uploadMode: documentUploadMode,
  };
};
