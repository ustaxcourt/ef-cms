import { state } from 'cerebral';

/**
 * starts scanning documents based on current data source
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the scanner API
 * @param {Function} providers.store the cerebral store used for setting state.path
 *
 */
export const handleScanErrorAction = async ({ props, store }) => {
  const err = props.error;
  if (err.message && err.message.includes('no images in buffer')) {
    store.set(state.showModal, 'EmptyHopperModal');
  } else {
    store.set(state.showModal, 'ScanErrorModal');
  }
  store.set(state.isScanning, false);
};
