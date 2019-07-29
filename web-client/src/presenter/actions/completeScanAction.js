import { state } from 'cerebral';

/**
 * sets the state.path based on the props.path passed in
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the scanner API
 * @param {Function} providers.get the cerebral get function getting state
 * @param {object} providers.props the cerebral props object used for getting the props.path
 * @param {objecg} providers.store the cerebral store used for setting state.path
 * @returns {Promise} async action
 */
export const completeScanAction = async ({
  applicationContext,
  get,
  props,
  store,
}) => {
  store.set(state.submitting, true);

  // wait a bit so that the spinner shows up because generatePDFFromPNGDataInteractor blocks the browser
  await new Promise(resolve => setTimeout(resolve, 100));
  const documentSelectedForScan = get(state.documentSelectedForScan);

  const batches = get(state.batches[documentSelectedForScan]);

  const scannedBuffer = [];
  batches.forEach(batch =>
    batch.pages.forEach(page => scannedBuffer.push(page)),
  );

  // this blocks the browser
  const pdfBlob = await applicationContext
    .getUseCases()
    .generatePDFFromPNGDataInteractor(scannedBuffer);

  const pdfFile = new File([pdfBlob], 'myfile.pdf');

  props.onComplete(pdfFile);
  store.set(state.submitting, false);
  store.set(state.isScanning, false);
};
