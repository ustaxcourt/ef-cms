import { clearModalSequence } from './clearModalSequence';
import { getFormValueDocumentAction } from '../actions/getFormValueDocumentAction';
import { handleScanErrorAction } from '../actions/handleScanErrorAction';
import { removeScannedPdfAction } from '../actions/removeScannedPdfAction';
import { setDocumentUploadModeSequence } from './setDocumentUploadModeSequence';
import { updateOrderForCdsAction } from '../actions/StartCaseInternal/updateOrderForCdsAction';
import { updateOrderForDesignatingPlaceOfTrialAction } from '../actions/updateOrderForDesignatingPlaceOfTrialAction';
import { validateDocumentSelectedForScanAction } from '../actions/validateDocumentSelectedForScanAction';

export const removeScannedPdfSequence = [
  validateDocumentSelectedForScanAction,
  {
    error: [handleScanErrorAction],
    success: [
      removeScannedPdfAction,
      setDocumentUploadModeSequence,
      clearModalSequence,
      getFormValueDocumentAction,
      updateOrderForDesignatingPlaceOfTrialAction,
      updateOrderForCdsAction,
    ],
  },
];
