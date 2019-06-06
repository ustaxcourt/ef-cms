import { state } from 'cerebral';

/**
 * starts scanning documents based on current data source
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the scanner API
 * @param {Function} providers.store the cerebral store used for setting state.path
 */
export const startScanAction = async ({ applicationContext, store }) => {
  store.set(state.isScanning, true);
  const scanner = applicationContext.getScanner();

  scanner.startScanSession();
};
