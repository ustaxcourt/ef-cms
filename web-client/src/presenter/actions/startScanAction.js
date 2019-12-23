import { state } from 'cerebral';

/**
 * starts scanning documents based on current data source
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the scanner API
 * @param {Function} providers.store the cerebral store used for setting state.path
 * @returns {object} the path to execute
 *
 */
export const startScanAction = async ({
  applicationContext,
  get,
  path,
  props,
  store,
}) => {
  const { duplexEnabled } = props;

  store.set(state.isScanning, true);
  const scanner = await applicationContext.getScanner();
  scanner.setSourceByIndex(props.scannerSourceIndex);
  try {
    const { scannedBuffer: pages } = await scanner.startScanSession({
      applicationContext,
      duplexEnabled,
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
    store.set(state.selectedBatchIndex, nextIndex);
    store.set(state.currentPageIndex, 0);
    return path.success();
  } catch (err) {
    return path.error({ error: err });
  }
};
