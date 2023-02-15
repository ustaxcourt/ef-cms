import { clearModalAction } from '../actions/clearModalAction';
import { getCachedScannerSourceAction } from '../actions/getCachedScannerSourceAction';
import { getScannerSourcesAction } from '../actions/getScannerSourcesAction';
import { handleInvalidScannerSourceAction } from '../actions/handleInvalidScannerSourceAction';
import { handleScanErrorAction } from '../actions/handleScanErrorAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startScanAction } from '../actions/startScanAction';
import { validateScannerSourceAction } from '../actions/validateScannerSourceAction';
import { waitForSpinnerAction } from '../actions/waitForSpinnerAction';

export const startScanSequence = showProgressSequenceDecorator([
  clearModalAction,
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
]);
