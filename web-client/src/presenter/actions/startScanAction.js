import { state } from 'cerebral';

/**
 * starts scanning documents based on current data source
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context used for getting the scanner API
 * @param {Function} providers.props the cerebral props object used for getting the props.scannerSourceName
 * @param {Function} providers.store the cerebral store used for setting state.path
 */
export const startScanAction = async ({ applicationContext, props, store }) => {
  store.set(state.isScanning, true);
  const scanner = applicationContext.getScanner();

  scanner.setSourceByName(props.scannerSourceName);
  scanner.startScanSession();
};
