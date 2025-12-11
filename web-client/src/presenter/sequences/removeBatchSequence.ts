import { clearModalAction } from '../actions/clearModalAction';
import { handleScanErrorAction } from '../actions/handleScanErrorAction';
import { removeBatchAction } from '../actions/removeBatchAction';
import { validateDocumentSelectedForScanAction } from '../actions/validateDocumentSelectedForScanAction';

export const removeBatchSequence = [
  clearModalAction,
  validateDocumentSelectedForScanAction,
  {
    error: [handleScanErrorAction],
    success: [removeBatchAction],
  },
];
