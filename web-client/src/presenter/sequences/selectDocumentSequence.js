import { validateSelectDocumentTypeAction } from '../actions/validateSelectDocumentTypeAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const selectDocumentSequence = [
  validateSelectDocumentTypeAction,
  {
    error: [setValidationErrorsAction],
    success: [set(state.form.isDocumentTypeSelected, true)],
  },
];
