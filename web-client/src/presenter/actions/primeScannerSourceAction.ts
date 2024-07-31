import { state } from '@web-client/presenter/app.cerebral';

/**
 * preps props to allow use of setScannerSourceAction from modal state
 * @param {object} providers the providers object
 * @param {Function} providers.get the cerebral get function
 * @returns {Promise} async action
 */
export const primeScannerSourceAction = ({
  applicationContext,
  get,
}: ActionProps) => {
  const { SCAN_MODES } = applicationContext.getConstants();

  const scannerSourceName = get(state.modal.scanner);
  const scanMode = get(state.modal.scanMode) || SCAN_MODES.FEEDER;

  let scannerSourceIndex = get(state.modal.index);
  scannerSourceIndex =
    typeof scannerSourceIndex === 'string'
      ? parseInt(scannerSourceIndex, 10)
      : scannerSourceIndex;

  return { scanMode, scannerSourceIndex, scannerSourceName };
};
