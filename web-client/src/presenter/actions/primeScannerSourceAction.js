import { state } from 'cerebral';

/**
 * preps props to allow use of setScannerSourceAction from modal state
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const primeScannerSourceAction = async ({ get }) => {
  const scannerSourceName = get(state.modal.scanner);
  const scannerSourceIndex = get(state.modal.index);
  const duplexEnabled = get(state.modal.duplexEnabled) || false;

  return { duplexEnabled, scannerSourceIndex, scannerSourceName };
};
