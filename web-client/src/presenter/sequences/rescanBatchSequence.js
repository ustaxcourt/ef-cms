import { clearModalAction } from '../actions/clearModalAction';
import { getCachedScannerSourceAction } from '../actions/getCachedScannerSourceAction';
import { getScannerSourcesAction } from '../actions/getScannerSourcesAction';
import { rescanBatchAction } from '../actions/rescanBatchAction';

import { set } from 'cerebral/factories';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { state } from 'cerebral';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';
import { waitForSpinnerAction } from '../actions/waitForSpinnerAction';

export const rescanBatchSequence = [
  setFormSubmittingAction,
  waitForSpinnerAction,
  getCachedScannerSourceAction,
  {
    selectSource: [
      clearModalAction,
      getScannerSourcesAction,
      set(state.showModal, 'SelectScannerSourceModal'),
    ],
    success: [rescanBatchAction],
  },
  unsetFormSubmittingAction,
];
