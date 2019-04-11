import { clearAlertsAction } from '../actions/clearAlertsAction';
import { set } from 'cerebral/factories';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { state } from 'cerebral';
import { validateExternalDocumentInformationAction } from '../actions/FileDocument/validateExternalDocumentInformationAction';

export const submitExternalDocumentInformationSequence = [
  set(state.showValidation, true),
  validateExternalDocumentInformationAction,
  {
    error: [setValidationErrorsAction],
    success: [set(state.showValidation, false), clearAlertsAction],
  },
];
