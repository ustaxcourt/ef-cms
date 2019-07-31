import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getScannerSourcesAction } from '../actions/getScannerSourcesAction';
import { primeScannerSelectModalAction } from '../actions/primeScannerSelectModalAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const openChangeScannerSourceModalSequence = [
  clearModalAction,
  clearModalStateAction,
  getScannerSourcesAction,
  primeScannerSelectModalAction,
  set(state.showModal, 'SelectScannerSourceModal'),
];
