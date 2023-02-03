import { state } from 'cerebral';

/**
 * starts scanning documents based on current data source
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the scanner API
 * @param {Function} providers.store the cerebral store object
 * @returns {object} the path to execute
 */
export const startScanAction = async ({
  applicationContext,
  get,
  path,
  props,
  store,
}) => {
  const { scanMode } = props;

  store.set(state.scanner.isScanning, true);
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
    const batches = get(state.scanner.batches[documentSelectedForScan]) || [];
    const nextIndex = batches.length
      ? Math.max(...batches.map(b => b.index)) + 1
      : 0;

    store.set(state.scanner.batches[documentSelectedForScan], [
      ...batches,
      ...[
        {
          index: nextIndex,
          pages,
          scanMode,
        },
      ],
    ]);
    store.set(state.scanner.selectedBatchIndex, nextIndex);
    store.set(state.scanner.currentPageIndex, 0);
    return path.success();
  } catch (err) {
    return path.error({ error: err });
  }
};
