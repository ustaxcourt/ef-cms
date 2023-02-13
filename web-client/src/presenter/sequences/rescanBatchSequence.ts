import { clearModalAction } from '../actions/clearModalAction';
import { getCachedScannerSourceAction } from '../actions/getCachedScannerSourceAction';
import { getScannerSourcesAction } from '../actions/getScannerSourcesAction';
import { handleInvalidScannerSourceAction } from '../actions/handleInvalidScannerSourceAction';
import { handleScanErrorAction } from '../actions/handleScanErrorAction';
import { rescanBatchAction } from '../actions/rescanBatchAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { validateScannerSourceAction } from '../actions/validateScannerSourceAction';
import { waitForSpinnerAction } from '../actions/waitForSpinnerAction';

export const rescanBatchSequence = showProgressSequenceDecorator([
  clearModalAction,
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
]);
