import { state } from 'cerebral';

/**
 * resets state for the current scan session
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state
 * @param {object} providers.store the cerebral store used for setting scan state
 * @returns {void}
 */

export const resetScanSessionAction = ({ get, store }) => {
  const documentSelectedForScan = get(
    state.currentViewMetadata.documentSelectedForScan,
  );
  const scans = get(state.scanner.batches);
  delete scans[documentSelectedForScan];
  store.set(state.scanner.batches, scans);
  store.set(state.scanner.isScanning, false);
};
