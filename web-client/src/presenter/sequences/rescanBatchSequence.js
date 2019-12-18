import { clearModalAction } from '../actions/clearModalAction';
import { getCachedScannerSourceAction } from '../actions/getCachedScannerSourceAction';
import { getScannerSourcesAction } from '../actions/getScannerSourcesAction';
import { rescanBatchAction } from '../actions/rescanBatchAction';

import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { waitForSpinnerAction } from '../actions/waitForSpinnerAction';

import { handleInvalidScannerSourceAction } from '../actions/handleInvalidScannerSourceAction';
import { handleScanErrorAction } from '../actions/handleScanErrorAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { validateScannerSourceAction } from '../actions/validateScannerSourceAction';

export const rescanBatchSequence = [
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
          rescanBatchAction,
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
