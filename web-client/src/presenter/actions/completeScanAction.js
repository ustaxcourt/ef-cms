import { state } from 'cerebral';

/**
 * sets the state.path based on the props.path passed in
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context used for getting the scanner API
 * @param {Function} providers.props the cerebral props object used for getting the props.path
 * @param {Function} providers.store the cerebral store used for setting state.path
 */
export const completeScanAction = async ({
  applicationContext,
  props,
  store,
}) => {
  const scanner = applicationContext.getScanner();
  const scannedBuffer = await scanner.completeScanSession();
  const pdfBlob = await applicationContext
    .getUseCases()
    .generatePDFFromPNGData(scannedBuffer);

  const pdfFile = new File([pdfBlob], 'myfile.pdf');

  props.onComplete(pdfFile);
  store.set(state.isScanning, false);
};
