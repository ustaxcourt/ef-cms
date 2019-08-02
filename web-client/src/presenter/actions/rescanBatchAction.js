import { state } from 'cerebral';

export const rescanBatchAction = async ({
  applicationContext,
  get,
  path,
  props,
  store,
}) => {
  store.set(state.isScanning, true);
  store.set(state.submitting, true);
  const batchIndex = get(state.batchIndexToRescan);
  const scanner = applicationContext.getScanner();
  scanner.setSourceByIndex(props.scannerSourceIndex);

  try {
    const { scannedBuffer: pages } = await scanner.startScanSession({
      applicationContext,
    });
    const documentSelectedForScan = get(state.documentSelectedForScan);
    const batches = get(state.batches[documentSelectedForScan]);
    batches.find(b => b.index === batchIndex).pages = pages;
    store.set(state.batches[documentSelectedForScan], batches);
    store.set(state.submitting, false);
    return path.success();
  } catch (err) {
    return path.error({ error: err });
  }
};
