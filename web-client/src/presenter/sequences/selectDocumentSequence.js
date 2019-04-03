import { clearModalAction } from '../actions/clearModalAction';
import { validateSelectDocumentTypeAction } from '../actions/validateSelectDocumentTypeAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { updateFormDocumentTypeFromModal } from '../actions/updateFormDocumentTypeFromModal';

export const selectDocumentSequence = [
  validateSelectDocumentTypeAction,
  {
    error: [setValidationErrorsAction],
    success: [updateFormDocumentTypeFromModal, clearModalAction],
  },
];
