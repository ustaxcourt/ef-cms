import { clearModalAction } from '../actions/clearModalAction';
import { getCachedScannerSourceAction } from '../actions/getCachedScannerSourceAction';
import { getScannerSourcesAction } from '../actions/getScannerSourcesAction';
import { handleInvalidScannerSourceAction } from '../actions/handleInvalidScannerSourceAction';
import { handleScanErrorAction } from '../actions/handleScanErrorAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startScanAction } from '../actions/startScanAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { validateScannerSourceAction } from '../actions/validateScannerSourceAction';
import { waitForSpinnerAction } from '../actions/waitForSpinnerAction';

export const startScanSequence = [
  clearModalAction,
  setWaitingForResponseAction,
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
      setShowModalFactoryAction('SelectScannerSourceModal'),
    ],
  },
  unsetWaitingForResponseAction,
];
