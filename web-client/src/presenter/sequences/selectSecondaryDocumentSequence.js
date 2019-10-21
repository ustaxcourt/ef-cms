import { set } from 'cerebral/factories';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { state } from 'cerebral';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateSelectDocumentTypeAction } from '../actions/validateSelectDocumentTypeAction';

export const selectSecondaryDocumentSequence = [
  startShowValidationAction,
  validateSelectDocumentTypeAction,
  {
    error: [setValidationErrorsAction],
    success: [
      stopShowValidationAction,
      set(state.screenMetadata.isSecondaryDocumentTypeSelected, true),
    ],
  },
];
