import { state } from '@web-client/presenter/app.cerebral';

/**
 * Sets the value of state.scanner.isScanning to false
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 */
export const setIsScanningFalseAction = ({ store }: ActionProps) => {
  store.set(state.scanner.isScanning, false);
};
