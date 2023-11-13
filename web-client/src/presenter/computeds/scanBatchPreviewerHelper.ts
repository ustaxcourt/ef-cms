import { getScanModeLabel } from '../../utilities/getScanModeLabel';
import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const scanBatchPreviewerHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const selectedBatchIndex = get(state.scanner.selectedBatchIndex) || 0;
  const documentSelectedForScan = get(
    state.currentViewMetadata.documentSelectedForScan,
  );
  const batches =
    (documentSelectedForScan &&
      get(state.scanner.batches[documentSelectedForScan])) ||
    [];
  const selectedBatch = batches.length
    ? batches.find(b => b.index === selectedBatchIndex)
    : { pages: [] };
  const currentPageIndex = get(state.scanner.currentPageIndex);
  const documentUploadMode = get(state.currentViewMetadata.documentUploadMode);
  let selectPageImage = null;

  const bufferToBase64 = buf => {
    const binstr = Array.prototype.map
      .call(buf, function (ch) {
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

  const scanMode = get(state.scanner.scanMode);
  const scannerSource = get(state.scanner.scannerSourceName);

  let scannerSourceDisplayName = 'None';

  if (scannerSource) {
    const scanModeLabel = getScanModeLabel(applicationContext, scanMode);
    scannerSourceDisplayName = `${scannerSource} (${scanModeLabel})`;
  }

  batches.forEach(batch => {
    batch.scanModeLabel = getScanModeLabel(applicationContext, batch.scanMode);
  });

  return {
    batches,
    currentPage: currentPageIndex,
    scannerSource,
    scannerSourceDisplayName,
    selectedBatch: batches.length
      ? batches.find(b => b.index === selectedBatchIndex)
      : {},
    selectedPageImage: selectPageImage,
    showScannerSourceModal:
      get(state.modal.showModal) === 'SelectScannerSourceModal',
    totalPages: selectedBatch.pages.length,
    uploadMode: documentUploadMode,
  };
};
