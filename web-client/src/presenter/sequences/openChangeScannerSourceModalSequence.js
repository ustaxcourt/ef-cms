import { clearModalAction } from '../actions/clearModalAction';
import { getScannerSourcesAction } from '../actions/getScannerSourcesAction';

import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const openChangeScannerSourceModalSequence = [
  clearModalAction,
  getScannerSourcesAction,
  set(state.showModal, 'SelectScannerSourceModal'),
];
