import { state } from 'cerebral';

/**
 * sets the state.path based on the props.path passed in
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the scanner API
 * @param {Function} providers.props the cerebral props object used for getting the props.path
 * @param {Function} providers.store the cerebral store used for setting state.path
 * @returns {Promise} async action
 */
export const completeScanAction = async ({
  applicationContext,
  props,
  store,
}) => {
  const scanner = applicationContext.getScanner();
  const { error, scannedBuffer } = await scanner.completeScanSession();

  if (error) {
    // let's handle the error
  } else {
    const pdfBlob = await applicationContext
      .getUseCases()
      .generatePDFFromPNGData(scannedBuffer);

    const pdfFile = new File([pdfBlob], 'myfile.pdf');

    props.onComplete(pdfFile);
    store.set(state.isScanning, false);
  }
};
