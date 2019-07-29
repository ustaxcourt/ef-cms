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
  get,
  props,
  store,
}) => {
  // const scanner = applicationContext.getScanner();
  // console.log('completing');
  // const { error, scannedBuffer } = await scanner.completeScanSession();
  store.set(state.submitting, true);

  // wait a bit so that the spinner shows up because generatePDFFromPNGDataInteractor blocks the browser
  await new Promise(resolve => setTimeout(resolve, 100));

  const batches = get(state.batches);

  const scannedBuffer = [];
  batches.forEach(batch =>
    batch.pages.forEach(page => scannedBuffer.push(page)),
  );

  // this blocks the browser
  const pdfBlob = await applicationContext
    .getUseCases()
    .generatePDFFromPNGDataInteractor(scannedBuffer);

  const pdfFile = new File([pdfBlob], 'myfile.pdf', {
    type: 'application/pdf',
  });

  props.onComplete(pdfFile);
  store.set(state.submitting, false);
  store.set(state.isScanning, false);
};
