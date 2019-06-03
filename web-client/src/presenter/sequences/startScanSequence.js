import { clearModalAction } from '../actions/clearModalAction';
import { getCachedScannerSourceAction } from '../actions/getCachedScannerSourceAction';
import { getScannerSourcesAction } from '../actions/getScannerSourcesAction';
import { startScanAction } from '../actions/startScanAction';

import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const startScanSequence = [
  getCachedScannerSourceAction,
  {
    selectSource: [
      clearModalAction,
      getScannerSourcesAction,
      set(state.showModal, 'SelectScannerSourceModal'),
    ],
    success: [startScanAction],
  },
];
