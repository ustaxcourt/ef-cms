import { state } from 'cerebral';

/**
 * starts scanning documents based on current data source
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the scanner API
 * @param {Function} providers.store the cerebral store used for setting state.path
 *
 */
export const startScanAction = async ({
  applicationContext,
  get,
  props,
  store,
}) => {
  store.set(state.isScanning, true);
  store.set(state.submitting, true);

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
      const batches = get(state.batches[documentSelectedForScan]) || [];
      const nextIndex = batches.length
        ? Math.max(...batches.map(b => b.index)) + 1
        : 0;

      store.set(state.batches[documentSelectedForScan], [
        ...batches,
        ...[
          {
            index: nextIndex,
            pages,
          },
        ],
      ]);
      store.set(state.submitting, false);
    } catch (err) {
      if (err.message && err.message.includes('no images in buffer')) {
        store.set(state.showModal, 'EmptyHopperModal');
      } else {
        store.set(state.showModal, 'ScanErrorModal');
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
    store.set(state.showModal, 'ScanErrorModal');
    store.set(state.scanner.scannerSourceName, null);
    store.set(state.scanner.scannerSourceIndex, null);
  }
};
