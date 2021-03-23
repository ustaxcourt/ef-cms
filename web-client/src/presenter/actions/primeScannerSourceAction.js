import { state } from 'cerebral';

/**
 * preps props to allow use of setScannerSourceAction from modal state
 *
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const primeScannerSourceAction = async ({ applicationContext, get }) => {
  const { SCAN_MODES } = applicationContext.getConstants();

  const scannerSourceName = get(state.modal.scanner);
  console.log('---scannerSourceName', scannerSourceName);
  const scannerSourceIndex = get(state.modal.index);
  console.log('---scannerSourceIndex', scannerSourceIndex);
  const scanMode = get(state.modal.scanMode) || SCAN_MODES.FEEDER;
  console.log('---scanMode', scanMode);

  return { scanMode, scannerSourceIndex, scannerSourceName };
};
