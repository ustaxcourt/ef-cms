import { validateSelectDocumentTypeAction } from '../actions/validateSelectDocumentTypeAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const selectDocumentSequence = [
  set(state.showValidation, true),
  validateSelectDocumentTypeAction,
  {
    error: [setValidationErrorsAction],
    success: [
      set(state.showValidation, false),
      set(state.form.isDocumentTypeSelected, true),
    ],
  },
];
