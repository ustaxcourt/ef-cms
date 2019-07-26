import { state } from 'cerebral';

export const rescanBatchAction = async ({
  applicationContext,
  get,
  props,
  store,
}) => {
  store.set(state.isScanning, true);
  store.set(state.submitting, true);
  const { batchIndex } = props;

  const scanner = applicationContext.getScanner();

  if (
    props.scannerSourceIndex !== null &&
    scanner.getSourceNameByIndex(props.scannerSourceIndex) ===
      props.scannerSourceName
  ) {
    scanner.setSourceByIndex(props.scannerSourceIndex);
    const { scannedBuffer: pages } = await scanner.startScanSession({
      applicationContext,
    });
    const batches = get(state.batches);
    batches[batchIndex].pages = pages;
    store.set(state.batches, batches);
    store.set(state.submitting, false);
  } else {
    await applicationContext.getUseCases().removeItemInteractor({
      applicationContext,
      key: 'scannerSourceIndex',
    });
    await applicationContext.getUseCases().removeItemInteractor({
      applicationContext,
      key: 'scannerSourceName',
    });
    store.set(state.isScanning, false);
    alert('there was an issue with the cached source; please scan again');
  }
};
