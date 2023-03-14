import { state } from 'cerebral';

/**
 * handles scanner errors passed via props
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object used for getting the props.error
 * @param {Function} providers.store the cerebral store used for setting error / scanner state
 * @returns {void}
 */
export const handleScanErrorAction = ({ props, store }) => {
  const err = props.error;
  if (err.message && err.message.includes('no images in buffer')) {
    store.set(state.modal.showModal, 'EmptyHopperModal');
  } else {
    store.set(state.modal.showModal, 'ScanErrorModal');
  }
  store.set(state.scanner.isScanning, false);
};
