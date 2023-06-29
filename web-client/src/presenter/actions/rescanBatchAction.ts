import { state } from '@web-client/presenter/app.cerebral';

/**
 * initiates a rescan session for the given batch
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function getting state
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {object} providers.props the cerebral props object used for getting the props.scannerSourceIndex
 * @param {object} providers.store the cerebral store used for setting the scan state
 * @returns {void}
 */

export const rescanBatchAction = async ({
  applicationContext,
  get,
  path,
  props,
  store,
}: ActionProps) => {
  const { scanMode } = props;

  store.set(state.scanner.isScanning, true);
  const batchIndex = get(state.scanner.batchIndexToRescan);
  const scanner = await applicationContext.getScanner();
  scanner.setSourceByIndex(props.scannerSourceIndex);

  try {
    const { scannedBuffer: pages } = await scanner.startScanSession({
      applicationContext,
      scanMode,
    });
    const documentSelectedForScan = get(
      state.currentViewMetadata.documentSelectedForScan,
    );
    const batches = get(state.scanner.batches[documentSelectedForScan]);
    batches.find(b => b.index === batchIndex).pages = pages;
    store.set(state.scanner.batches[documentSelectedForScan], batches);
    store.set(state.scanner.isScanning, false);
    store.set(state.scanner.selectedBatchIndex, batchIndex);
    store.set(state.scanner.currentPageIndex, 0);
    return path.success();
  } catch (err) {
    return path.error({ error: err });
  }
};
