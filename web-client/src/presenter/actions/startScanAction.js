import { state } from 'cerebral';

/**
 * starts scanning documents based on current data source
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the scanner API
 * @param {Function} providers.store the cerebral store used for setting state.path
 *
 */
export const startScanAction = async ({ applicationContext, props, store }) => {
  store.set(state.isScanning, true);

  const scanner = applicationContext.getScanner();

  if (
    props.scannerSourceIndex !== null &&
    scanner.getSourceNameByIndex(props.scannerSourceIndex) ===
      props.scannerSourceName
  ) {
    scanner.setSourceByIndex(props.scannerSourceIndex);
    scanner.startScanSession();
    store.set(state.submitting, false);
  } else {
    await applicationContext.getUseCases().removeItem({
      applicationContext,
      key: 'scannerSourceIndex',
    });
    await applicationContext.getUseCases().removeItem({
      applicationContext,
      key: 'scannerSourceName',
    });
    store.set(state.isScanning, false);
    alert('there was an issue with the cached source; please scan again');
  }
};
