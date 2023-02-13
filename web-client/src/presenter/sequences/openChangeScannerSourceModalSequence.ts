import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getScannerSourcesAction } from '../actions/getScannerSourcesAction';
import { loadCachedScannerSourceAction } from '../actions/loadCachedScannerSourceAction';
import { primeScannerSelectModalAction } from '../actions/primeScannerSelectModalAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';

export const openChangeScannerSourceModalSequence = [
  clearModalAction,
  clearModalStateAction,
  getScannerSourcesAction,
  loadCachedScannerSourceAction,
  primeScannerSelectModalAction,
  setShowModalFactoryAction('SelectScannerSourceModal'),
];
