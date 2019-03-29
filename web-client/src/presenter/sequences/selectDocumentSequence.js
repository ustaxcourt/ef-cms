import { set } from 'cerebral/factories';
import { state } from 'cerebral';
import { clearModalAction } from '../actions/clearModalAction';
import { validateSelectDocumentTypeAction } from '../actions/validateSelectDocumentTypeAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';

export const selectDocumentSequence = [
  set(state.form.isDocumentTypeSelected, true),
  validateSelectDocumentTypeAction,
  {
    error: [setValidationErrorsAction],
    success: [clearModalAction],
  },
];
