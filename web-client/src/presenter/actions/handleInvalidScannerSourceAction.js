import { state } from 'cerebral';

export const handleInvalidScannerSourceAction = async ({
  applicationContext,
  store,
}) => {
  await applicationContext.getUseCases().removeItemInteractor({
    applicationContext,
    key: 'scannerSourceIndex',
  });
  await applicationContext.getUseCases().removeItemInteractor({
    applicationContext,
    key: 'scannerSourceName',
  });
  store.set(state.isScanning, false);
  store.set(state.showModal, 'ScanErrorModal');
  store.set(state.scanner.scannerSourceName, null);
  store.set(state.scanner.scannerSourceIndex, null);
};
