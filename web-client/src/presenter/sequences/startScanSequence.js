import { clearModalAction } from '../actions/clearModalAction';
import { getCachedScannerSourceAction } from '../actions/getCachedScannerSourceAction';
import { getScannerSourcesAction } from '../actions/getScannerSourcesAction';
import { handleInvalidScannerSourceAction } from '../actions/handleInvalidScannerSourceAction';
import { handleScanErrorAction } from '../actions/handleScanErrorAction';
import { set } from 'cerebral/factories';
import { setFormSubmittingAction } from '../actions/setFormSubmittingAction';
import { startScanAction } from '../actions/startScanAction';
import { state } from 'cerebral';
import { unsetFormSubmittingAction } from '../actions/unsetFormSubmittingAction';
import { validateScannerSourceAction } from '../actions/validateScannerSourceAction';
import { waitForSpinnerAction } from '../actions/waitForSpinnerAction';

export const startScanSequence = [
  clearModalAction,
  setFormSubmittingAction,
  waitForSpinnerAction,
  getCachedScannerSourceAction,
  {
    sourceInCache: [
      validateScannerSourceAction,
      {
        invalid: [handleInvalidScannerSourceAction],
        valid: [
          startScanAction,
          {
            error: [handleScanErrorAction],
            success: [],
          },
        ],
      },
    ],
    sourceNotInCache: [
      getScannerSourcesAction,
      set(state.showModal, 'SelectScannerSourceModal'),
    ],
  },
  unsetFormSubmittingAction,
];
