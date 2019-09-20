import { state } from 'cerebral';

/**
 * resets state for the current scan session
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function used for getting state
 * @param {object} providers.store the cerebral store used for setting scan state
 * @returns {void}
 */

export const resetScanSessionAction = async ({ get, store }) => {
  const documentSelectedForScan = get(state.documentSelectedForScan);
  const scans = get(state.batches);
  delete scans[documentSelectedForScan];
  store.set(state.batches, scans);
  store.set(state.isScanning, false);
};
