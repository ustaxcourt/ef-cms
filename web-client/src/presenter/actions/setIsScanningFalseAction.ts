import { state } from 'cerebral';

/**
 * Sets the value of state.scanner.isScanning to false
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const setIsScanningFalseAction = ({ store }) => {
  store.set(state.scanner.isScanning, false);
};
