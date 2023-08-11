import { state } from '@web-client/presenter/app.cerebral';

/**
 * prime modal state for selecting a scanner
 * @param {object} providers the providers object
 * @param {Function} providers.store the cerebral store used for setting state.scanner.sources
 * @param {Function} providers.get the cerebral get function
 */
export const primeScannerSelectModalAction = ({ get, store }: ActionProps) => {
  store.set(state.modal.scanner, get(state.scanner.scannerSourceName));
  store.set(state.modal.index, get(state.scanner.scannerSourceIndex));
  store.set(state.modal.scanMode, get(state.scanner.scanMode));
};
