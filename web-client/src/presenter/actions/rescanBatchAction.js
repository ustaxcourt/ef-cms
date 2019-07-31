import { state } from 'cerebral';

export const rescanBatchAction = async ({
  applicationContext,
  get,
  props,
  store,
}) => {
  store.set(state.isScanning, true);
  store.set(state.submitting, true);
  const batchIndex = get(state.batchIndexToRescan);

  const scanner = applicationContext.getScanner();

  if (
    props.scannerSourceIndex !== null &&
    scanner.getSourceNameByIndex(props.scannerSourceIndex) ===
      props.scannerSourceName
  ) {
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
    } catch (err) {
      if (err.message.includes('no images in buffer')) {
        store.set(state.showModal, 'EmptyHopperModal');
      }
      store.set(state.isScanning, false);
    }
  } else {
    await applicationContext.getUseCases().removeItemInteractor({
      applicationContext,
      key: 'scannerSourceIndex',
    });
    await applicationContext.getUseCases().removeItemInteractor({
      applicationContext,
      key: 'scannerSourceName',
    });
    store.set(state.isScanning, false);
    alert('there was an issue with the cached source; please scan again');
  }
};
