import { state } from 'cerebral';

export const handleInvalidScannerSourceAction = async ({
  applicationContext,
  store,
}) => {
  await applicationContext
    .getUseCases()
    .removeItemInteractor(applicationContext, {
      key: 'scannerSourceIndex',
    });
  await applicationContext
    .getUseCases()
    .removeItemInteractor(applicationContext, {
      key: 'scannerSourceName',
    });
  store.set(state.scanner.isScanning, false);
  store.set(state.modal.showModal, 'ScanErrorModal');
  store.unset(state.scanner.scannerSourceName);
  store.unset(state.scanner.scannerSourceIndex);
};
